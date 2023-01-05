import { Message } from 'node-nats-streaming';

import { Subjects, Listener, OrderCreatedEvent } from '@eotickets/common';
import { queueGroupName } from './queue-group-name';
import { TicketService } from '../../services/ticket-service';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      //find the ticket that the order is reserving
      const ticket = await TicketService.getTicketById(data.ticket.id);
      // if not ticket trow error
      if (!ticket) throw new Error('ticket not found');

      //  mark the ticket as being reserved by setting its orderId property
      await TicketService.updateTicket(ticket, { orderId: data.id });
      new TicketUpdatedPublisher(this.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
        orderId: ticket.orderId,
      });

      //ack the message
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}

