import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  BadRequestError,
  validateRequestMiddleware,
  TokenService,
} from '@eotickets/common';
import { UserService } from '../services/user-service';
import { PasswordService } from '../services/password-service';

const router = Router();

export type SigninRequest = {
  email: string;
  password: string;
};

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('You must supply a password'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { email, password } = req.body as SigninRequest;

    const existingUser = await UserService.getUserByEmail(email);

    if (!existingUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordMatch = await PasswordService.compare(
      password,
      existingUser.password
    );

    if (!passwordMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = await TokenService.generate({
      id: existingUser.id,
      email: existingUser.email,
    });

    req.session = {
      jwt: userJwt,
    };

    res.status(200).send(existingUser);
  }
);

export { router as signInRouter };
