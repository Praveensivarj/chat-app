import { Router } from 'express';
import { UsersController } from '../controllers/users.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { validate } from '../middleware/validation.middleware';
import { userValidator } from '../validators/user.validator';

const router = Router();
const controller = new UsersController();

router.use(authMiddleware);

router.get('/profile', controller.getProfile);
router.put('/profile', controller.updateProfile);
router.post('/change-password', validate(userValidator.changePassword), controller.changePassword);

export default router;
