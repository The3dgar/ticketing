import {
  Subjects,
  Listener,
  OrderCancelledEvent,
  OrderStatus,
} from '@eotickets/common';
import { Message } from 'node-nats-streaming';

import { queueGroupName } from './queue-group-name';
import { OrderService } from '../../services/order-service';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    try {
      const order = await OrderService.getOrder({
        id: data.id,
        version: data.version - 1,
      });

      if (!order) {
        throw new Error('Order not found');
      }

      await OrderService.updateOrder(order, { status: OrderStatus.Cancelled });
      //ack the message
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
