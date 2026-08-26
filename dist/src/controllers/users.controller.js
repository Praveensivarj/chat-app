"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const models_1 = require("../models");
class UsersController {
    getProfile = async (req, res, next) => {
        try {
            const user = await models_1.User.findByPk(req.user.userId, {
                attributes: { exclude: ['passwordHash', 'email_otp', 'email_otp_expiry'] },
            });
            return res.sendResponse(3010, user);
        }
        catch (error) {
            next(error);
        }
    };
    updateProfile = async (req, res, next) => {
        try {
            const user = req.currentUser;
            const updatableFields = ['timezone', 'gender', 'mobile', 'mobile_country_code'];
            for (const field of updatableFields) {
                if (req.body[field] !== undefined) {
                    user[field] = req.body[field];
                }
            }
            await user.save();
            const updated = await models_1.User.findByPk(req.user.userId, {
                attributes: { exclude: ['passwordHash', 'email_otp', 'email_otp_expiry'] },
            });
            return res.sendResponse(3011, updated);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.UsersController = UsersController;
