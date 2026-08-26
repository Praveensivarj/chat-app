import { Request, Response, NextFunction } from 'express';
import { createHmac, createPublicKey, createVerify } from 'node:crypto';
import { User } from '../models';

const REPLAY_WINDOW_SECONDS = 300;

const cleanBody = (body: any): any => {
    if (body === null || body === undefined) {
        return '';
    }
    if (Array.isArray(body)) {
        return body.map(cleanBody);
    }
    if (typeof body === 'object') {
        const cleaned: Record<string, any> = {};
        for (const [key, value] of Object.entries(body)) {
            cleaned[key] = cleanBody(value);
        }
        return cleaned;
    }
    return body;
};

export const signatureMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const apiKey = req.header('x-api-key');
        const signature = req.header('x-api-signature');
        const timestampHeader = req.header('x-api-timestamp');

        if (!apiKey || !signature || !timestampHeader) {
            return res.sendError(1002);
        }

        const requestTime = parseInt(timestampHeader, 10);
        if (!Number.isFinite(requestTime)) {
            return res.sendError(1005);
        }
        const drift = Math.abs(Math.floor(Date.now() / 1000) - requestTime);
        if (drift > REPLAY_WINDOW_SECONDS) {
            return res.sendError(1005);
        }

        const user = await User.findOne({ where: { api_key: apiKey } });
        if (!user || !user.publick_key || !user.salt_key) {
            return res.sendError(1002);
        }

        const publicKeyPem = user.publick_key;
        const saltKey = user.salt_key;

        const lastSegment = req.path.split('/').filter(Boolean).pop() ?? '';
        const endpoint = `/${lastSegment}`;
        const rawPayload = { ...req.query, ...(req.body || {}) };
        const cleanedBody = cleanBody(rawPayload);
        const bodyJson =
            cleanedBody && Object.keys(cleanedBody as object).length === 0
                ? '{}'
                : JSON.stringify(cleanedBody);

        const plainContent = `${endpoint}${bodyJson}${timestampHeader}${saltKey}`;
        const hmac = createHmac('sha256', saltKey).update(plainContent).digest('hex');

        const publicKey = createPublicKey({ key: publicKeyPem, format: 'pem' });
        const verifier = createVerify('RSA-SHA256');
        verifier.update(hmac);
        verifier.end();

        const isValid = verifier.verify(publicKey, Buffer.from(signature, 'base64'));
        if (!isValid) {
            return res.sendError(1002);
        }

        next();
    } catch (error) {
        return res.sendError(1002);
    }
};
