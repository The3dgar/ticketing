import { Message } from 'node-nats-streaming';

import { Subjects, Listener, TicketCreatedEvent } from '@eotickets/common';
import { queueGroupName } from './queue-group-name';
import { TicketService } from '../../services/ticket-service';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { id, price, title } = data;
    try {
      await TicketService.createTicket({ title, price, id });
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
