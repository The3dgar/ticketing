import { Router, Request, Response } from 'express';
import { NotFoundError, validateRequestMiddleware } from '@eotickets/common';
import { param } from 'express-validator';
import { TicketService } from '../services/ticket-service';

const router = Router();

router.get(
  '/api/tickets/:id',
  [param('id').isMongoId().withMessage('id must be valid')],
  validateRequestMiddleware,
  async (req: Request, res: Response) => {
    const ticket = await TicketService.getTicketById(req.params.id);
    if (!ticket) throw new NotFoundError();
    res.send(ticket);
  }
);

export { router as getTicketRouter };
