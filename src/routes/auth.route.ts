import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authValidator } from '../validators/auth.validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const controller = new AuthController();

router.post(
    '/register',
    validate(authValidator.register),
    controller.register,
);
router.post('/login', validate(authValidator.login), controller.login);
router.post('/refresh', validate(authValidator.refresh), controller.refresh);

router.post('/forgot-password', validate(authValidator.forgotPassword), controller.forgotPassword);
router.post(
    '/verify-forgot-password',
    validate(authValidator.verifyForgotPassword),
    controller.verifyForgotPassword,
);
router.post('/reset-password', validate(authValidator.resetPassword), controller.resetPassword);
router.post('/email-verify', validate(authValidator.emailVerify), controller.emailVerify);
router.post('/resend-email-otp', validate(authValidator.resendEmailOtp), controller.resendEmailOtp);

router.post('/logout', authMiddleware, controller.logout);
router.post('/logout-all', authMiddleware, controller.logoutAll);
router.get('/session', authMiddleware, controller.getSession);

router.get('/get-credentials', authMiddleware, controller.getCredentials);

export default router;
