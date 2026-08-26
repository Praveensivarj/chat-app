"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTokens = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const generateTokens = (userId, sessionId) => {
    const accessToken = jsonwebtoken_1.default.sign({ userId, sessionId }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: (process.env.ACCESS_TOKEN_EXPIRES_IN || '15m'),
    });
    const refreshToken = node_crypto_1.default.randomBytes(40).toString('hex');
    const refreshTokenHash = node_crypto_1.default.createHash('sha256').update(refreshToken).digest('hex');
    return { accessToken, refreshToken, refreshTokenHash };
};
exports.generateTokens = generateTokens;
