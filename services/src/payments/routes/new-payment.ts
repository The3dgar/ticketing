import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  RequireAuthMiddleware,
  validateRequestMiddleware,
  NotFoundError,
  BadRequestError,
  NotAuthorizedError,
  OrderStatus,
} from '@eotickets/common';

import { natsWrapper } from '../events/nats-wrapper';
import { OrderService } from '../services/order-service';
import { stripe } from '../services/stripe-service';
import { Payment } from '../models/payment';
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publisher';

const router = Router();

router.post(
  '/api/payments',
  RequireAuthMiddleware,
  [
    body('token').notEmpty(),
    body('orderId')
      .notEmpty()
      .isMongoId()
      .withMessage('orderId must be provided'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await OrderService.getOrderById(orderId);
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }

    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError('Cannot pay for and cancelled order');
    }

    const charge = await stripe.charges.create({
      currency: 'usd',
      amount: order.price * 100,
      source: token,
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });

    await payment.save();
    await new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    res.status(201).send({
      id: payment.id,
    });
  }
);

export { router as newPaymentRoute };
