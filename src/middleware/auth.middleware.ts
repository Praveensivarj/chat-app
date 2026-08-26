import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.sendError(1002);
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as {
            userId: string;
            sessionId: string;
        };

        const user = await User.findByPk(decoded.userId);
        if (!user) {
            return res.sendError(1003);
        }

        req.user = { userId: decoded.userId, sessionId: decoded.sessionId };
        (req as any).currentUser = user;

        next();
    } catch (error) {
        return res.sendError(1005);
    }
};
