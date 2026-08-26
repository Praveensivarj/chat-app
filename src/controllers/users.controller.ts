import { Request, Response, NextFunction } from 'express';
import { User } from '../models';
import { AppError } from '../errors/app.error';
import { verifyAndUpgradePassword, comparePassword, hashPassword } from '../utils/common.utils';

export class UsersController {
    getProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findByPk(req.user!.userId, {
                attributes: { exclude: ['passwordHash', 'email_otp', 'email_otp_expiry'] },
            });

            return res.sendResponse(3010, user);
        } catch (error) {
            next(error);
        }
    };

    updateProfile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = (req as any).currentUser;

            const updatableFields = ['timezone', 'gender', 'mobile', 'mobile_country_code'];
            for (const field of updatableFields) {
                if (req.body[field] !== undefined) {
                    (user as any)[field] = req.body[field];
                }
            }

            await user.save();

            const updated = await User.findByPk(req.user!.userId, {
                attributes: { exclude: ['passwordHash', 'email_otp', 'email_otp_expiry'] },
            });

            return res.sendResponse(3011, updated);
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const user = await User.findByPk(req.user!.userId);
            if (!user) return res.sendError(1011);

            const { valid } = await verifyAndUpgradePassword(user.passwordHash, req.body.oldPassword);
            if (!valid) {
                return res.sendError(1004); // Invalid old password
            }

            const isSame = await comparePassword(req.body.newPassword, user.passwordHash);
            if (isSame) {
                return res.sendError(1017); // New password cannot be the same as the previous password
            }

            user.passwordHash = await hashPassword(req.body.newPassword);
            await user.save();

            return res.sendResponse(3011); // Or appropriate success code
        } catch (error) {
            next(error);
        }
    };
}
