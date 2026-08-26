import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

export const generateTokens = (userId: string, sessionId: string) => {
    const accessToken = jwt.sign({ userId, sessionId }, process.env.JWT_ACCESS_SECRET as string, {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m') as any,
    });

    const refreshToken = crypto.randomBytes(40).toString('hex');
    const refreshTokenHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    return { accessToken, refreshToken, refreshTokenHash };
};
