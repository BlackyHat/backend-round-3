const router = require('express').Router();
import { authMiddleware } from '../middlewares/auth-middleware';
import { userController } from '../controllers/users-controller';

router.get('/', authMiddleware, userController);

export { router as userRouter };
