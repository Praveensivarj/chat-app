import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    require('fs').appendFileSync('/tmp/chat_api_error.log', err.toString() + '\n' + err.stack + '\n' + (err.original ? err.original.message : '') + '\n');
    const customCode = err.errorCode || 1008;
    const statusCode = err.statusCode || 500;

    if (statusCode === 500) {
        console.error('Unhandled Error:', err);
    }

    return res.sendError(customCode, err.details || err.message, statusCode);
};
