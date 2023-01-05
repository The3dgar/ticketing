import { Message } from 'node-nats-streaming';
import { Subjects, Listener, OrderCreatedEvent } from '@eotickets/common';
import { queueGroupName } from './queue-group-name';
import { expirationQueue } from '../../queues/expirations-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    try {
      //ack the message
      const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
      console.log('waiting this many milliseconds to process the job', delay);
      
      await expirationQueue.add(
        { orderId: data.id },
        {
          delay,
        }
      );
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
