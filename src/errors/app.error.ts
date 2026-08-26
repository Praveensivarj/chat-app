export class AppError extends Error {
    public statusCode: number;
    public errorCode: number;

    constructor(errorCode: number, statusCode: number = 400) {
        super(errorCode.toString());
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
