import { Router } from 'express';
import { currentUserRouter } from './current-user';
import { signInRouter } from './signin';
import { signOutRouter } from './signout';
import { signUpRouter } from './signup';

const authRouter = Router();
authRouter.use(currentUserRouter);
authRouter.use(signInRouter);
authRouter.use(signUpRouter);
authRouter.use(signOutRouter);

export { authRouter };
