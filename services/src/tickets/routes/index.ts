import { Router, Request, Response } from 'express';
import { TicketService } from '../services/ticket-service';

const router = Router();

router.get(
  '/api/tickets',
  async (req: Request, res: Response) => {
    const ticket = await TicketService.getTickets();

    res.send(ticket);
  }
);

export { router as indexTicketRouter };
