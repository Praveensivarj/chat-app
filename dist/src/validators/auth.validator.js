"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidator = void 0;
const joi_1 = __importDefault(require("joi"));
exports.authValidator = {
    register: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).max(128).required(),
        timezone: joi_1.default.string().optional(),
        gender: joi_1.default.string().valid('male', 'female', 'other').optional(),
        mobile: joi_1.default.string().optional(),
        mobile_country_code: joi_1.default.string().optional(),
    }).options({ stripUnknown: false, presence: 'required' }), // stripUnknown: false to reject unknown keys
    login: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().required(),
        deviceId: joi_1.default.string().required(),
        deviceName: joi_1.default.string().optional(),
        platform: joi_1.default.string().optional(),
    }).options({ stripUnknown: false }),
    refresh: joi_1.default.object({
        refreshToken: joi_1.default.string().required(),
    }).options({ stripUnknown: false }),
    forgotPassword: joi_1.default.object({
        email: joi_1.default.string().email().required(),
    }).options({ stripUnknown: false }),
    verifyForgotPassword: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        otp: joi_1.default.string().length(6).required(),
    }).options({ stripUnknown: false }),
    resetPassword: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        otp: joi_1.default.string().length(6).required(),
        newPassword: joi_1.default.string().min(8).max(128).required(),
    }).options({ stripUnknown: false }),
    emailVerify: joi_1.default.object({
        email: joi_1.default.string().email().required(),
        otp: joi_1.default.string().length(6).required(),
    }).options({ stripUnknown: false }),
    resendEmailOtp: joi_1.default.object({
        email: joi_1.default.string().email().required(),
    }).options({ stripUnknown: false }),
};
