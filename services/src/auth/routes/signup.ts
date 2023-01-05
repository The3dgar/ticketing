import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequestMiddleware,
  TokenService,
} from '@eotickets/common';
import { UserService } from '../services/user-service';
import { SigninRequest } from './signin';


const router = Router();
export const signupRoute = '/api/users/signup';

router.post(
  signupRoute,
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body as SigninRequest;

    const existingUser = await UserService.getUserByEmail(email);

    if (existingUser) {
      throw new BadRequestError('Email already exists');
    }

    const user = await UserService.createUser({ email, password });
    const userJwt = await TokenService.generate({
      id: user.id,
      email: user.email,
    });

    req.session = {
      jwt: userJwt,
    };

    res.status(201).send(user);
  }
);

export { router as signUpRouter };
