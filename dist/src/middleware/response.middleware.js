"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMiddleware = void 0;
const responseMiddleware = (req, res, next) => {
    res.sendResponse = (code, data = {}) => {
        const statusCode = code === 3002 || code === 3005 ? 201 : 200;
        return res.status(statusCode).json({
            success: true,
            code,
            message: res.__(code.toString()),
            data,
        });
    };
    res.sendError = (code, errorDetail = null, statusCode) => {
        let status = statusCode || 400;
        if (!statusCode) {
            if (code === 1002)
                status = 401;
            if (code === 1003)
                status = 404;
            if (code === 1004)
                status = 401;
            if (code === 1005)
                status = 401;
            if (code === 1007)
                status = 403;
            if (code === 1008)
                status = 500;
        }
        return res.status(status).json({
            success: false,
            error_code: code,
            error: res.__(code.toString()),
        });
    };
    next();
};
exports.responseMiddleware = responseMiddleware;
