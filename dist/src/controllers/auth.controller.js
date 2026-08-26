"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    authService = new auth_service_1.AuthService();
    register = async (req, res, next) => {
        try {
            return await this.authService.register(req.body, res);
        }
        catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            return await this.authService.login(req.body, req, res);
        }
        catch (error) {
            next(error);
        }
    };
    refresh = async (req, res, next) => {
        try {
            return await this.authService.refresh(req.body.refreshToken, req, res);
        }
        catch (error) {
            next(error);
        }
    };
    logout = async (req, res, next) => {
        try {
            return await this.authService.logout(req.user.sessionId, res);
        }
        catch (error) {
            next(error);
        }
    };
    logoutAll = async (req, res, next) => {
        try {
            return await this.authService.logoutAll(req.user.userId, res);
        }
        catch (error) {
            next(error);
        }
    };
    getSession = async (req, res, next) => {
        try {
            return await this.authService.getSession(req.user.sessionId, res);
        }
        catch (error) {
            next(error);
        }
    };
    forgotPassword = async (req, res, next) => {
        try {
            return await this.authService.forgotPassword(req.body.email, res);
        }
        catch (error) {
            next(error);
        }
    };
    verifyForgotPassword = async (req, res, next) => {
        try {
            return await this.authService.verifyForgotPassword(req.body.email, req.body.otp, res);
        }
        catch (error) {
            next(error);
        }
    };
    resetPassword = async (req, res, next) => {
        try {
            return await this.authService.resetPassword(req.body, res);
        }
        catch (error) {
            next(error);
        }
    };
    emailVerify = async (req, res, next) => {
        try {
            return await this.authService.emailVerify(req.body.email, req.body.otp, res);
        }
        catch (error) {
            next(error);
        }
    };
    resendEmailOtp = async (req, res, next) => {
        try {
            return await this.authService.resendEmailOtp(req.body.email, res);
        }
        catch (error) {
            next(error);
        }
    };
    getCredentials = async (req, res, next) => {
        try {
            return await this.authService.getCredentials(req.user.userId, res);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.AuthController = AuthController;
