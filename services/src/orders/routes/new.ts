import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import {
  RequireAuthMiddleware,
  validateRequestMiddleware,
  NotFoundError,
  BadRequestError,
} from '@eotickets/common';

import { TicketService } from '../services/ticket-service';
import { OrderService } from '../services/order-service';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../events/nats-wrapper';

const router = Router();

router.post(
  '/api/orders',
  RequireAuthMiddleware,
  [
    body('ticketId')
      .notEmpty()
      .isMongoId()
      .withMessage('ticketId must be provided'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    // find the ticket the user id is trying to order in db
    const ticket = await TicketService.getTicketById(req.body.ticketId);
    if (!ticket) throw new NotFoundError();

    // make sure that the tk is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) throw new BadRequestError('Ticket is already reserved');

    // build the order and save it to the db
    const order = await OrderService.createOrder({
      userId: req.currentUser!.id,
      ticket,
    });

    // emit an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      version: order.version,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    });

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
