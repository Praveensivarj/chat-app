"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const node_crypto_1 = __importDefault(require("node:crypto"));
const models_1 = require("../models");
const sequelize_1 = require("sequelize");
const token_helper_1 = require("../helpers/token.helper");
const common_utils_1 = require("../utils/common.utils");
const user_resource_1 = require("../resources/user.resource");
const session_resource_1 = require("../resources/session.resource");
const email_service_1 = require("./email.service");
class AuthService {
    async register(data, res) {
        const orConditions = [{ email: data.email }];
        if (data.mobile) {
            orConditions.push({ mobile: data.mobile });
        }
        const existing = await models_1.User.findOne({
            where: { [sequelize_1.Op.or]: orConditions }
        });
        if (existing) {
            if (existing.email === data.email) {
                return res.sendError(1010); // Email exists
            }
            if (data.mobile && existing.mobile === data.mobile) {
                return res.sendError(1015); // Mobile exists
            }
        }
        const hashed = await (0, common_utils_1.hashPassword)(data.password);
        const otp = (0, common_utils_1.randomNumber)(6);
        const { publicKey, privateKey } = (0, common_utils_1.generateRsaKeyPair)();
        const apiKey = (0, common_utils_1.generateApiKey)();
        const saltKey = (0, common_utils_1.generateSaltKey)();
        // generate a separate long-lived opaque token if they want access_token in the DB as well
        const permanentAccessToken = (0, common_utils_1.generateApiKey)();
        const user = await models_1.User.create({
            email: data.email,
            passwordHash: hashed,
            email_otp: otp,
            email_otp_expiry: new Date((0, common_utils_1.generateEmailCodeExpiry)(15)),
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
            email_service_1.EmailService.sendOtpEmail(user.email, otp, 'registration').catch(console.error);
        });
        return res.sendResponse(3005, { user: (0, user_resource_1.shapeLoginUser)(user) });
    }
    async login(data, req, res) {
        const user = await models_1.User.findOne({ where: { email: data.email } });
        if (!user)
            return res.sendError(1004);
        if (!user.email_verified_at) {
            return res.sendError(1006);
        }
        const { valid, rehash } = await (0, common_utils_1.verifyAndUpgradePassword)(user.passwordHash, data.password);
        if (!valid)
            return res.sendError(1004);
        if (rehash) {
            user.passwordHash = rehash;
            await user.save();
        }
        const sessionId = node_crypto_1.default.randomUUID();
        const { accessToken, refreshToken, refreshTokenHash } = (0, token_helper_1.generateTokens)(user.id, sessionId);
        await models_1.Session.create({
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
        return res.sendResponse(3006, { user: (0, user_resource_1.shapeLoginUser)(user), access_token: accessToken });
    }
    async refresh(refreshToken, req, res) {
        const refreshTokenHash = node_crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
        const session = await models_1.Session.findOne({ where: { refreshTokenHash, revokedAt: null } });
        if (!session || session.expiresAt < new Date()) {
            return res.sendError(1005);
        }
        const { accessToken, refreshToken: newRefresh, refreshTokenHash: newHash, } = (0, token_helper_1.generateTokens)(session.userId, session.id);
        session.refreshTokenHash = newHash;
        session.lastActiveAt = new Date();
        session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        session.ipAddress = req.ip || null;
        await session.save();
        return res.sendResponse(3001, (0, user_resource_1.authTokensToJSON)(null, accessToken, newRefresh));
    }
    async logout(sessionId, res) {
        await models_1.Session.update({ revokedAt: new Date() }, { where: { id: sessionId } });
        return res.sendResponse(3007);
    }
    async logoutAll(userId, res) {
        await models_1.Session.update({ revokedAt: new Date() }, { where: { userId, revokedAt: null } });
        return res.sendResponse(3007);
    }
    async getSession(sessionId, res) {
        const session = await models_1.Session.findByPk(sessionId);
        return res.sendResponse(3001, (0, session_resource_1.sessionToJSON)(session));
    }
    async forgotPassword(email, res) {
        const user = await models_1.User.findOne({ where: { email } });
        if (!user)
            return res.sendError(1011);
        const otp = (0, common_utils_1.randomNumber)(6);
        user.email_otp = otp;
        user.email_otp_expiry = new Date((0, common_utils_1.generateEmailCodeExpiry)(15)); // 15 mins
        await user.save();
        // In production, send email here
        setImmediate(() => {
            email_service_1.EmailService.sendOtpEmail(user.email, otp, 'password_reset').catch(console.error);
        });
        return res.sendResponse(3008, { success: true });
    }
    async verifyForgotPassword(email, otp, res) {
        const user = await models_1.User.findOne({ where: { email } });
        if (!user)
            return res.sendError(1011);
        if (user.email_otp !== otp ||
            !user.email_otp_expiry ||
            user.email_otp_expiry < new Date()) {
            return res.sendError(1012);
        }
        return res.sendResponse(3009);
    }
    async resetPassword(data, res) {
        const user = await models_1.User.findOne({ where: { email: data.email } });
        if (!user)
            return res.sendError(1011);
        if (user.email_otp !== data.otp ||
            !user.email_otp_expiry ||
            user.email_otp_expiry < new Date()) {
            return res.sendError(1012);
        }
        user.passwordHash = await (0, common_utils_1.hashPassword)(data.newPassword);
        user.email_otp = null;
        user.email_otp_expiry = null;
        await user.save();
        // Optionally revoke all active sessions on password reset
        await models_1.Session.update({ revokedAt: new Date() }, { where: { userId: user.id, revokedAt: null } });
        return res.sendResponse(3010);
    }
    async emailVerify(email, otp, res) {
        const user = await models_1.User.findOne({ where: { email } });
        if (!user)
            return res.sendError(1011);
        if (user.email_otp !== otp ||
            !user.email_otp_expiry ||
            user.email_otp_expiry < new Date()) {
            return res.sendError(1012);
        }
        user.email_verified_at = new Date();
        user.email_otp = null;
        user.email_otp_expiry = null;
        await user.save();
        return res.sendResponse(3011);
    }
    async resendEmailOtp(email, res) {
        const user = await models_1.User.findOne({ where: { email } });
        if (!user)
            return res.sendError(1011);
        if (user.email_verified_at) {
            return res.sendError(1013);
        }
        const otp = (0, common_utils_1.randomNumber)(6);
        user.email_otp = otp;
        user.email_otp_expiry = new Date((0, common_utils_1.generateEmailCodeExpiry)(15)); // 15 mins
        await user.save();
        // In production, send email here
        setImmediate(() => {
            email_service_1.EmailService.sendOtpEmail(user.email, otp, 'resend').catch(console.error);
        });
        return res.sendResponse(3008, { success: true });
    }
    async getCredentials(userId, res) {
        let user = await models_1.User.findByPk(userId);
        if (!user) {
            return res.sendError(1002);
        }
        // eficyent-node-api rotates the keys every time getCredentials is called
        // but for now we just return them or generate if missing
        if (!user.api_key || !user.salt_key || !user.private_key) {
            const { publicKey, privateKey } = (0, common_utils_1.generateRsaKeyPair)();
            user.api_key = (0, common_utils_1.generateApiKey)();
            user.salt_key = (0, common_utils_1.generateSaltKey)();
            user.private_key = privateKey;
            user.publick_key = publicKey;
            await user.save();
        }
        return res.sendResponse(3010, {
            user: (0, user_resource_1.shapeCredentials)(user)
        });
    }
}
exports.AuthService = AuthService;
