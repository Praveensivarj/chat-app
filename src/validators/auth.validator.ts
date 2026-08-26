import Joi from 'joi';

export const authValidator = {
    register: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
        confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({ 'any.only': 'Passwords do not match' }),
        timezone: Joi.string().optional(),
        gender: Joi.string().valid('male', 'female', 'other').optional(),
        mobile: Joi.string().optional(),
        mobile_country_code: Joi.string().optional(),
    }).options({ stripUnknown: false, presence: 'required' }), // stripUnknown: false to reject unknown keys

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        deviceId: Joi.string().required(),
        deviceName: Joi.string().optional(),
        platform: Joi.string().optional(),
    }).options({ stripUnknown: false }),

    refresh: Joi.object({
        refreshToken: Joi.string().required(),
    }).options({ stripUnknown: false }),

    forgotPassword: Joi.object({
        email: Joi.string().email().required(),
    }).options({ stripUnknown: false }),

    verifyForgotPassword: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
    }).options({ stripUnknown: false }),

    resetPassword: Joi.object({
        token: Joi.string().required(),
        newPassword: Joi.string().min(8).max(128).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': 'Passwords do not match' }),
    }).options({ stripUnknown: false }),

    emailVerify: Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.string().length(6).required(),
    }).options({ stripUnknown: false }),

    resendEmailOtp: Joi.object({
        email: Joi.string().email().required(),
    }).options({ stripUnknown: false }),
};
