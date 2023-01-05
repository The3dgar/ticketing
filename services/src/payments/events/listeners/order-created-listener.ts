import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@eotickets/common';

import { queueGroupName } from './queue-group-name';
import { OrderService } from '../../services/order-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      await OrderService.createOrder({
        id: data.id,
        price: data.ticket.price,
        status: data.status,
        version: data.version,
        userId: data.userId,
      });

      //ack the message
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
