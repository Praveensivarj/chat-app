"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSaltKey = exports.generateApiKey = exports.generateRsaKeyPair = void 0;
const crypto_1 = require("crypto");
const generateRsaKeyPair = () => {
    return (0, crypto_1.generateKeyPairSync)('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
};
exports.generateRsaKeyPair = generateRsaKeyPair;
const generateApiKey = () => {
    return (0, crypto_1.randomBytes)(40).toString('base64url');
};
exports.generateApiKey = generateApiKey;
const generateSaltKey = () => {
    return (0, crypto_1.randomBytes)(8).toString('hex');
};
exports.generateSaltKey = generateSaltKey;
