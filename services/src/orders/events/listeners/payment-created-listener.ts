import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  PaymentCreatedEvent,
  OrderStatus,
} from '@eotickets/common';
import { queueGroupName } from './queue-group-name';
import { OrderService } from '../../services/order-service';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    try {
      const order = await OrderService.getOrderById(data.orderId);
      if (!order) {
        throw new Error('Order not found');
      }

      await OrderService.updateOrder(order, {
        status: OrderStatus.Complete,
      });
      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
