"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError extends Error {
    statusCode;
    errorCode;
    constructor(errorCode, statusCode = 400) {
        super(errorCode.toString());
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
exports.AppError = AppError;
