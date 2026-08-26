import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { User, Session } from '../models';
import { Op } from 'sequelize';
import { AppError } from '../errors/app.error';
import { generateTokens } from '../helpers/token.helper';
import { 
    generateApiKey, 
    generateSaltKey, 
    generateRsaKeyPair,
    hashPassword,
    comparePassword,
    verifyAndUpgradePassword,
    generateEmailCodeExpiry,
    randomNumber
} from '../utils/common.utils';
import { shapeLoginUser, authTokensToJSON, shapeCredentials } from '../resources/user.resource';
import { sessionToJSON } from '../resources/session.resource';
import { EmailService } from './email.service';
import { Request, Response } from 'express';

export class AuthService {
    async register(data: any, res: Response) {
        const orConditions: any[] = [{ email: data.email }];
        if (data.mobile) {
            orConditions.push({ mobile: data.mobile });
        }

        const existing = await User.findOne({ 
            where: { [Op.or]: orConditions }
        });

        if (existing) {
            if (existing.email === data.email) {
                return res.sendError(1010); // Email exists
            }
            if (data.mobile && existing.mobile === data.mobile) {
                return res.sendError(1015); // Mobile exists
            }
        }
        const hashed = await hashPassword(data.password);
        const otp = randomNumber(6);
        const { publicKey, privateKey } = generateRsaKeyPair();
        const apiKey = generateApiKey();
        const saltKey = generateSaltKey();
        // generate a separate long-lived opaque token if they want access_token in the DB as well
        const permanentAccessToken = generateApiKey();

        const user = await User.create({
            email: data.email,
            passwordHash: hashed,
            email_otp: otp,
            email_otp_expiry: new Date(generateEmailCodeExpiry(15)),
            api_key: apiKey,
            salt_key: saltKey,
            access_token: permanentAccessToken,
            private_key: privateKey,
            publick_key: publicKey,
            timezone: data.timezone || null,
            gender: data.gender || null,
            mobile: data.mobile || null,
            mobile_country_code: data.mobile_country_code || null,
        });

        // In production, send email verification OTP here
        setImmediate(() => {
            EmailService.sendOtpEmail(user.email, otp, 'registration').catch(console.error);
        });
        return res.sendResponse(3005, { user: shapeLoginUser(user) });
    }

    async login(data: any, req: Request, res: Response) {
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) return res.sendError(1004);

        if (!user.email_verified_at) {
            return res.sendError(1006);
        }

        const { valid, rehash } = await verifyAndUpgradePassword(user.passwordHash, data.password);
        if (!valid) return res.sendError(1004);

        if (rehash) {
            user.passwordHash = rehash;
            await user.save();
        }

        const sessionId = crypto.randomUUID();
        const { accessToken, refreshToken, refreshTokenHash } = generateTokens(user.id, sessionId);

        await Session.create({
            id: sessionId,
            userId: user.id,
            refreshTokenHash,
            deviceId: data.deviceId,
            deviceName: data.deviceName || null,
            platform: data.platform || null,
            ipAddress: req.ip || null,
            userAgent: req.headers['user-agent'] || null,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        });

        return res.sendResponse(3006, { user: shapeLoginUser(user), access_token: accessToken });
    }

    async refresh(refreshToken: string, req: Request, res: Response) {
        const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const session = await Session.findOne({ where: { refreshTokenHash, revokedAt: null } });

        if (!session || session.expiresAt < new Date()) {
            return res.sendError(1005);
        }

        const {
            accessToken,
            refreshToken: newRefresh,
            refreshTokenHash: newHash,
        } = generateTokens(session.userId, session.id);

        session.refreshTokenHash = newHash;
        session.lastActiveAt = new Date();
        session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        session.ipAddress = req.ip || null;
        await session.save();

        return res.sendResponse(3001, authTokensToJSON(null, accessToken, newRefresh));
    }

    async logout(sessionId: string, res: Response) {
        await Session.update({ revokedAt: new Date() }, { where: { id: sessionId } });
        return res.sendResponse(3007);
    }

    async logoutAll(userId: string, res: Response) {
        await Session.update({ revokedAt: new Date() }, { where: { userId, revokedAt: null } });
        return res.sendResponse(3007);
    }

    async getSession(sessionId: string, res: Response) {
        const session = await Session.findByPk(sessionId);
        return res.sendResponse(3001, sessionToJSON(session));
    }

    async forgotPassword(email: string, res: Response) {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.sendError(1011);

        const otp = randomNumber(6);
        user.email_otp = otp;
        user.email_otp_expiry = new Date(generateEmailCodeExpiry(15)); // 15 mins
        await user.save();

        // In production, send email here
        setImmediate(() => {
            EmailService.sendOtpEmail(user.email, otp, 'password_reset').catch(console.error);
        });
        return res.sendResponse(3008, { success: true });
    }

    async verifyForgotPassword(email: string, otp: string, res: Response) {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.sendError(1011);
        if (
            user.email_otp !== otp ||
            !user.email_otp_expiry ||
            user.email_otp_expiry < new Date()
        ) {
            return res.sendError(1012);
        }
        
        // Generate a time-limited reset token
        const token = jwt.sign(
            { userId: user.id, purpose: 'password_reset' },
            process.env.JWT_ACCESS_SECRET || 'secret',
            { expiresIn: '15m' }
        );

        // Nullify the OTP so it can't be reused to generate more tokens
        user.email_otp = null;
        user.email_otp_expiry = null;
        await user.save();

        return res.sendResponse(3009, { token });
    }

    async resetPassword(data: any, res: Response) {
        let decoded: any;
        try {
            decoded = jwt.verify(data.token, process.env.JWT_ACCESS_SECRET || 'secret');
            if (decoded.purpose !== 'password_reset') {
                return res.sendError(1016);
            }
        } catch (error) {
            return res.sendError(1016); // Invalid or expired token
        }

        const user = await User.findByPk(decoded.userId);
        if (!user) return res.sendError(1011);

        const isSame = await comparePassword(data.newPassword, user.passwordHash);
        if (isSame) {
            return res.sendError(1017); // New password cannot be the same as the previous password
        }

        user.passwordHash = await hashPassword(data.newPassword);
        await user.save();

        // Optionally revoke all active sessions on password reset
        await Session.update(
            { revokedAt: new Date() },
            { where: { userId: user.id, revokedAt: null } },
        );
        return res.sendResponse(3010);
    }

    async emailVerify(email: string, otp: string, res: Response) {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.sendError(1011);
        if (
            user.email_otp !== otp ||
            !user.email_otp_expiry ||
            user.email_otp_expiry < new Date()
        ) {
            return res.sendError(1012);
        }

        user.email_verified_at = new Date();
        user.email_otp = null;
        user.email_otp_expiry = null;
        await user.save();
        return res.sendResponse(3011);
    }

    async resendEmailOtp(email: string, res: Response) {
        const user = await User.findOne({ where: { email } });
        if (!user) return res.sendError(1011);

        if (user.email_verified_at) {
            return res.sendError(1013);
        }

        const otp = randomNumber(6);
        user.email_otp = otp;
        user.email_otp_expiry = new Date(generateEmailCodeExpiry(15)); // 15 mins
        await user.save();

        // In production, send email here
        setImmediate(() => {
            EmailService.sendOtpEmail(user.email, otp, 'resend').catch(console.error);
        });
        return res.sendResponse(3008, { success: true });
    }

    async getCredentials(userId: string, res: Response) {
        let user = await User.findByPk(userId);
        if (!user) {
            return res.sendError(1002);
        }

        // eficyent-node-api rotates the keys every time getCredentials is called
        // but for now we just return them or generate if missing
        if (!user.api_key || !user.salt_key || !user.private_key) {
            const { publicKey, privateKey } = generateRsaKeyPair();
            user.api_key = generateApiKey();
            user.salt_key = generateSaltKey();
            user.private_key = privateKey;
            user.publick_key = publicKey;
            await user.save();
        }

        return res.sendResponse(3010, {
            user: shapeCredentials(user)
        });
    }
}
