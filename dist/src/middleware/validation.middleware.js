"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const validate = (schema) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            stripUnknown: false,
        });
        if (error) {
            return res.sendError(1001, error.details);
        }
        req.body = value;
        next();
    };
};
exports.validate = validate;
