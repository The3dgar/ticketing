import { Message } from 'node-nats-streaming';

import { Subjects, Listener, TicketUpdatedEvent } from '@eotickets/common';
import { queueGroupName } from './queue-group-name';
import { TicketService } from '../../services/ticket-service';

export class TicketUpdatedtedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    
    const { id, price, title, version } = data;
    const ticket = await TicketService.findByEvent(id, version);
    if (!ticket) {
      // todo
      throw new Error('Ticket not found');
    }

    await TicketService.updateTicket(ticket, { price, title });
    msg.ack();
  }
}
