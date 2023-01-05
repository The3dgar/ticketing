import {
  RequireAuthMiddleware,
  validateRequestMiddleware,
} from '@eotickets/common';
import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { TicketService } from '../services/ticket-service';

import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { natsWrapper } from '../events/nats-wrapper';

const router = Router();

interface TicketBody {
  title: string;
  price: number;
}

router.post(
  '/api/tickets',
  RequireAuthMiddleware,
  [
    body('title').notEmpty().withMessage('title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('price must be greater than zero'),
  ],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const ticket = await TicketService.createTicket({
      ...(req.body as TicketBody),
      userId: req.currentUser!.id,
    });
    
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.status(201).send(ticket);
  }
);

export { router as createTicketRouter };
