import { Router } from 'express';
import { indexTicketRouter } from '.';
import { getTicketRouter } from './get-tickets';
import { createTicketRouter } from './new';
import { updateTicketRouter } from './update';

const ticketsRouter = Router();
ticketsRouter.use(createTicketRouter)
ticketsRouter.use(getTicketRouter)
ticketsRouter.use(indexTicketRouter)
ticketsRouter.use(updateTicketRouter)

export { ticketsRouter };
