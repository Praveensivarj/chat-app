import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

export class AuthController {
    private authService = new AuthService();

    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.register(req.body, res);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.login(req.body, req, res);
        } catch (error) {
            next(error);
        }
    };

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.refresh(req.body.refreshToken, req, res);
        } catch (error) {
            next(error);
        }
    };

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.logout(req.user!.sessionId, res);
        } catch (error) {
            next(error);
        }
    };

    logoutAll = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.logoutAll(req.user!.userId, res);
        } catch (error) {
            next(error);
        }
    };

    getSession = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.getSession(req.user!.sessionId, res);
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.forgotPassword(req.body.email, res);
        } catch (error) {
            next(error);
        }
    };

    verifyForgotPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.verifyForgotPassword(req.body.email, req.body.otp, res);
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.resetPassword(req.body, res);
        } catch (error) {
            next(error);
        }
    };

    emailVerify = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.emailVerify(req.body.email, req.body.otp, res);
        } catch (error) {
            next(error);
        }
    };

    resendEmailOtp = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.resendEmailOtp(req.body.email, res);
        } catch (error) {
            next(error);
        }
    };

    getCredentials = async (req: Request, res: Response, next: NextFunction) => {
        try {
            return await this.authService.getCredentials(req.user!.userId, res);
        } catch (error) {
            next(error);
        }
    };
}
