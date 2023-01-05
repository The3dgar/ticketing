import {
  NotAuthorizedError,
  NotFoundError,
  RequireAuthMiddleware,
} from '@eotickets/common';
import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { OrderService } from '../services/order-service';

const router = Router();

router.get(
  '/api/orders/:orderId',
  [
    param('orderId')
      .notEmpty()
      .isMongoId()
      .withMessage('orderId must be provided'),
  ],
  RequireAuthMiddleware,
  async (req: Request, res: Response) => {
    const order = await OrderService.getOrderById(req.params.orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    res.send(order);
  }
);

export { router as showOrderRouter };
