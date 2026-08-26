import { Request, Response, NextFunction } from 'express';
import { ConversationService } from '../services/conversation.service';

export class ConversationController {
    private service = new ConversationService();

    createDirect = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const conv = await this.service.createDirect(req.user!.userId, req.body.userId);
            return res.sendResponse(3002, conv);
        } catch (e) {
            next(e);
        }
    };

    createGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const group = await this.service.createGroup(
                req.user!.userId,
                req.body.name,
                req.body.userIds,
            );
            return res.sendResponse(3002, group);
        } catch (e) {
            next(e);
        }
    };

    sendMessage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const msg = await this.service.sendMessage(
                req.user!.userId,
                req.params.id as string,
                req.body,
            );
            return res.sendResponse(3002, msg);
        } catch (e) {
            next(e);
        }
    };

    getMessages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const messages = await this.service.getMessages(
                req.user!.userId,
                req.params.id as string,
                req.query,
            );
            return res.sendResponse(3001, messages);
        } catch (e) {
            next(e);
        }
    };
}
