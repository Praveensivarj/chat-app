import { Router } from 'express';
import authRoutes from './auth.route';
import conversationRoutes from './conversation.route';
import userRoutes from './user.route';
import lookupRoutes from './lookup.route';

const router = Router();

router.use('/user', authRoutes);
router.use('/user', userRoutes);
router.use('/user/conversations', conversationRoutes);
router.use('/user/lookups', lookupRoutes);

export default router;
