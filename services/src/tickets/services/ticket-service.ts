import { natsWrapper } from '../events/nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';
import { TicketAttrs, Ticket, TicketDoc } from '../models/ticket';

export class TicketService {
  static getTickets() {
    return Ticket.find({});
  }

  static async getTicketById(id: string) {
    const ticket = await Ticket.findById(id);
    return ticket;
  }

  static async createTicket(params: TicketAttrs) {
    const ticket = Ticket.build(params);
    await ticket.save();
    return ticket;
  }

  static async updateTicket(ticket: TicketDoc, params: Partial<TicketAttrs>) {
    ticket.set(params);
    await ticket.save();
    return ticket;
  }

  static async publishTicket(ticket: TicketDoc) {
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });
  }
}
