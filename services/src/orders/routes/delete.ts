import {
  NotAuthorizedError,
  NotFoundError,
  RequireAuthMiddleware,
} from '@eotickets/common';
import { Router, Request, Response } from 'express';
import { param } from 'express-validator';
import { OrderService } from '../services/order-service';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../events/nats-wrapper';

const router = Router();

router.delete(
  '/api/orders/:orderId',
  RequireAuthMiddleware,
  [
    param('orderId')
      .notEmpty()
      .isMongoId()
      .withMessage('orderId must be provided'),
  ],
  async (req: Request, res: Response) => {
    const order = await OrderService.getOrderById(req.params.orderId);

    if (!order) throw new NotFoundError();
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    const updatedOrder = await OrderService.deleteOrder(order);
    // publishing an event saying this was cancelled!
    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
    res.status(204).send(updatedOrder);
  }
);

export { router as deleteOrderRouter };
