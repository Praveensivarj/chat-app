declare namespace Express {
    export interface Request {
        user?: {
            userId: string;
            sessionId: string;
        };
        currentUser?: any;
    }
}
