"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appSignatureIfEnforced = exports.appSignature = void 0;
const crypto_1 = require("crypto");
const user_model_1 = require("../models/user.model");
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
const appSignature = async (req, res, next) => {
    try {
        const apiKey = req.header('x-api-key');
        const signature = req.header('x-api-signature');
        const timestampHeader = req.header('x-api-timestamp');
        if (!apiKey) {
            return res.sendError(110);
        }
        if (!signature) {
            return res.sendError(111);
        }
        if (!timestampHeader) {
            return res.sendError(128);
        }
        const requestTime = parseInt(timestampHeader, 10);
        if (!Number.isFinite(requestTime)) {
            return res.sendError(128);
        }
        const drift = Math.abs(Math.floor(Date.now() / 1000) - requestTime);
        if (drift > REPLAY_WINDOW_SECONDS) {
            return res.sendError(129);
        }
        const caller = await user_model_1.User.findOne({
            where: { api_key: apiKey },
        });
        if (!caller || !caller.publick_key || !caller.salt_key) {
            return res.sendError(102);
        }
        const publicKeyPem = caller.publick_key;
        const saltKey = caller.salt_key;
        const lastSegment = req.path.split('/').filter(Boolean).pop() ?? '';
        const endpoint = `/${lastSegment}`;
        const rawPayload = { ...req.query, ...(req.body || {}) };
        const cleanedBody = cleanBody(rawPayload);
        const bodyJson = cleanedBody && Object.keys(cleanedBody).length === 0
            ? '{}'
            : JSON.stringify(cleanedBody);
        const plainContent = `${endpoint}${bodyJson}${timestampHeader}${saltKey}`;
        const hmac = (0, crypto_1.createHmac)('sha256', saltKey).update(plainContent).digest('hex');
        const publicKey = (0, crypto_1.createPublicKey)({
            key: publicKeyPem,
            format: 'pem',
        });
        const verifier = (0, crypto_1.createVerify)('RSA-SHA256');
        verifier.update(hmac);
        verifier.end();
        const isValid = verifier.verify(publicKey, Buffer.from(signature, 'base64'));
        if (!isValid) {
            return res.sendError(112);
        }
        next();
    }
    catch (error) {
        console.error('Signature validation error:', error);
        return res.sendError(500);
    }
};
exports.appSignature = appSignature;
const appSignatureIfEnforced = (req, res, next) => {
    if (process.env.SIGNATURE_ENFORCED === 'true') {
        void (0, exports.appSignature)(req, res, next);
        return;
    }
    next();
};
exports.appSignatureIfEnforced = appSignatureIfEnforced;
