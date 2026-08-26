import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { AppError } from '../errors/app.error';

export const validate = (schema: Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
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
