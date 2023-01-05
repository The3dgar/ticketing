import { Message } from 'node-nats-streaming';

import {
  Subjects,
  Listener,
  ExpirationCompleteEvent,
  OrderStatus,
} from '@eotickets/common';
import { queueGroupName } from './queue-group-name';
import { OrderService } from '../../services/order-service';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompleteEvent['data'], msg: Message) {
    try {
      const order = await OrderService.getOrderById(data.orderId);

      if (!order) {
        throw new Error('Order not found');
      }

      if (order.status === OrderStatus.Complete) {
        return msg.ack();
      }

      await OrderService.updateOrder(order, {
        status: OrderStatus.Cancelled,
      });

      await new OrderCancelledPublisher(this.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
          id: order.ticket.id,
        },
      });

      msg.ack();
    } catch (error) {
      console.log(error);
    }
  }
}
