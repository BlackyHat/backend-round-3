const router = require('express').Router();
import { signUpController, signInController } from '../controllers/auth-controller';
import { validateAuth } from '../validation/auth.validation';

router.post('/sign-up', validateAuth, signUpController);
router.post('/sign-in', validateAuth, signInController);

export { router as authRouter };
