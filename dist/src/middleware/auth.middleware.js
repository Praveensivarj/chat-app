"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendError(1002);
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_ACCESS_SECRET);
        const user = await models_1.User.findByPk(decoded.userId);
        if (!user) {
            return res.sendError(1003);
        }
        req.user = { userId: decoded.userId, sessionId: decoded.sessionId };
        req.currentUser = user;
        next();
    }
    catch (error) {
        return res.sendError(1005);
    }
};
exports.authMiddleware = authMiddleware;
