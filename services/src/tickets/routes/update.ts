import { Router, Request, Response } from 'express';
import {
  RequireAuthMiddleware,
  validateRequestMiddleware,
  NotAuthorizedError,
  NotFoundError,
  BadRequestError,
} from '@eotickets/common';
import { TicketService } from '../services/ticket-service';
import { body } from 'express-validator';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';
import { natsWrapper } from '../events/nats-wrapper';

const router = Router();

router.put(
  '/api/tickets/:id',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price is required'),
  ],
  validateRequestMiddleware,
  RequireAuthMiddleware,
  async (req: Request, res: Response) => {
    const ticket = await TicketService.getTicketById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.orderId) {
      throw new BadRequestError('Cannot edit a reserved ticket');
    }

    if (ticket.userId !== req.currentUser?.id) {
      throw new NotAuthorizedError();
    }
    /**
     *  1. start db session transaction
     *  2. save tickets
     *  3. save event in event collection with status 'no emmited'
     *  4. close transaccion
     *  5. emit event
     *  6. update event status to 'emmited
     */

    /**
     *  create a subprogram that must be attended to check events with 'no emitted' status
     *  when get some events, re-emmited and update his status
     */

    await TicketService.updateTicket(ticket, req.body);

    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
    res.send(ticket);
  }
);

export { router as updateTicketRouter };
