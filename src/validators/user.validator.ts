import Joi from 'joi';

export const userValidator = {
    changePassword: Joi.object({
        oldPassword: Joi.string().required(),
        newPassword: Joi.string().min(8).max(128).required(),
        confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({ 'any.only': 'Passwords do not match' }),
    }).options({ stripUnknown: false }),
};
