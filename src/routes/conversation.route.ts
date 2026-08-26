import { Router } from 'express';
import { ConversationController } from '../controllers/conversations.controller';
import { validate } from '../middleware/validation.middleware';
import { conversationValidator } from '../validators/conversation.validator';
import { authMiddleware } from '../middleware/auth.middleware';
import { signatureMiddleware } from '../middleware/signature.middleware';

const router = Router();
const controller = new ConversationController();

router.use(authMiddleware, signatureMiddleware);

router.post('/direct', validate(conversationValidator.createDirect), controller.createDirect);
router.post('/group', validate(conversationValidator.createGroup), controller.createGroup);
router.post('/:id/messages', validate(conversationValidator.sendMessage), controller.sendMessage);

// Use a specific validation middleware for query params
import { Schema } from 'joi';
import { AppError } from '../errors/app.error';
const validateQuery = (schema: Schema) => (req: any, res: any, next: any) => {
    const { error, value } = schema.validate(req.query, { stripUnknown: false });
    if (error) return next(new AppError(1001, 400));
    req.query = value;
    next();
};

router.get(
    '/:id/messages',
    validateQuery(conversationValidator.getMessages),
    controller.getMessages,
);

export default router;
