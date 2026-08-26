"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signatureMiddleware = void 0;
const node_crypto_1 = require("node:crypto");
const models_1 = require("../models");
const REPLAY_WINDOW_SECONDS = 300;
const cleanBody = (body) => {
    if (body === null || body === undefined) {
        return '';
    }
    if (Array.isArray(body)) {
        return body.map(cleanBody);
    }
    if (typeof body === 'object') {
        const cleaned = {};
        for (const [key, value] of Object.entries(body)) {
            cleaned[key] = cleanBody(value);
        }
        return cleaned;
    }
    return body;
};
const signatureMiddleware = async (req, res, next) => {
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
        const user = await models_1.User.findOne({ where: { api_key: apiKey } });
        if (!user || !user.publick_key || !user.salt_key) {
            return res.sendError(1002);
        }
        const publicKeyPem = user.publick_key;
        const saltKey = user.salt_key;
        const lastSegment = req.path.split('/').filter(Boolean).pop() ?? '';
        const endpoint = `/${lastSegment}`;
        const rawPayload = { ...req.query, ...(req.body || {}) };
        const cleanedBody = cleanBody(rawPayload);
        const bodyJson = cleanedBody && Object.keys(cleanedBody).length === 0
            ? '{}'
            : JSON.stringify(cleanedBody);
        const plainContent = `${endpoint}${bodyJson}${timestampHeader}${saltKey}`;
        const hmac = (0, node_crypto_1.createHmac)('sha256', saltKey).update(plainContent).digest('hex');
        const publicKey = (0, node_crypto_1.createPublicKey)({ key: publicKeyPem, format: 'pem' });
        const verifier = (0, node_crypto_1.createVerify)('RSA-SHA256');
        verifier.update(hmac);
        verifier.end();
        const isValid = verifier.verify(publicKey, Buffer.from(signature, 'base64'));
        if (!isValid) {
            return res.sendError(1002);
        }
        next();
    }
    catch (error) {
        return res.sendError(1002);
    }
};
exports.signatureMiddleware = signatureMiddleware;
