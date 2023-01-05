import { CurrentUserMiddleware } from '@eotickets/common';
import { Router, Request, Response } from 'express';

const router = Router();
export const currentUserRoute = '/api/users/current-user'

router.get(
  currentUserRoute,
  CurrentUserMiddleware,
  async (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };
