import { Request, Response, NextFunction } from 'express';

declare global {
    namespace Express {
        interface Response {
            sendResponse(code: number, data?: any): void;
            sendError(code: number, error?: any, statusCode?: number): void;
        }
    }
}

export const responseMiddleware = (req: Request, res: Response, next: NextFunction) => {
    res.sendResponse = (code: number, data: any = {}) => {
        const statusCode = code === 3002 || code === 3005 ? 201 : 200;
        return res.status(statusCode).json({
            success: true,
            code,
            message: res.__(code.toString()),
            data,
        });
    };

    res.sendError = (code: number, errorDetail: any = null, statusCode?: number) => {
        let status = statusCode || 400;
        if (!statusCode) {
            if (code === 1002) status = 401;
            if (code === 1003) status = 404;
            if (code === 1004) status = 401;
            if (code === 1005) status = 401;
            if (code === 1007) status = 403;
            if (code === 1008) status = 500;
        }

        let errorMessage = res.__(code.toString());

        // Extract detailed validation message if errorDetail is a Joi error array
        if (errorDetail && Array.isArray(errorDetail) && errorDetail.length > 0 && errorDetail[0].message) {
            errorMessage = errorDetail[0].message.replace(/"/g, ''); // Strip quotes from Joi path
        } else if (typeof errorDetail === 'string') {
            errorMessage = errorDetail;
        }

        return res.status(status).json({
            success: false,
            error_code: code,
            error: errorMessage,
        });
    };

    next();
};
