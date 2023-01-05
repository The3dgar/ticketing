import { TicketAttrs, Ticket, TicketDoc } from '../models/ticket';

interface TicketUpdatedProps {
  price: number;
  title: string;
}

interface TicketCreatedProps {
  title: string;
  price: number;
}

export class TicketService {
  static getTickets() {
    return Ticket.find({});
  }

  static async getTicketById(id: string) {
    const ticket = await Ticket.findById(id);
    return ticket;
  }

  static async findByEvent(id: string, version: number) {
    const ticket = await Ticket.findByEvent({id, version});
    return ticket;
  }

  static async createTicket(params: TicketAttrs) {
    const ticket = Ticket.build(params);
    await ticket.save();
    return ticket;
  }

  static async updateTicket(ticket: TicketDoc, params: TicketUpdatedProps) {
    ticket.set(params);
    // this line under, update the version
    await ticket.save();
    // return ticket;
  }
}
