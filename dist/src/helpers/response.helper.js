"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.sendError = exports.sendResponse = void 0;
const sendResponse = (res, statusCode, messageKey, customCode, data = {}) => {
    return res.status(statusCode).json({
        success: true,
        code: customCode,
        message: res.__(messageKey) || messageKey,
        data
    });
};
exports.sendResponse = sendResponse;
const sendError = (res, statusCode, messageKey, customCode, error = null) => {
    return res.status(statusCode).json({
        success: false,
        code: customCode,
        message: res.__(messageKey) || messageKey,
        error
    });
};
exports.sendError = sendError;
const handleError = (res, error) => {
    const statusCode = error.statusCode || 500;
    const customCode = error.errorCode || 1008; // 1008 = INTERNAL_SERVER_ERROR
    if (statusCode === 500) {
        console.error('Unhandled Error:', error);
    }
    return (0, exports.sendError)(res, statusCode, error.message || 'ERROR.INTERNAL_SERVER_ERROR', customCode, error.details || null);
};
exports.handleError = handleError;
