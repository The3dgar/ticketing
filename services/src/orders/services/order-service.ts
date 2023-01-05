import { OrderStatus } from '@eotickets/common';
import { config } from '../config/config';
import { natsWrapper } from '../events/nats-wrapper';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { Order, OrderDoc, OrderAttrs } from '../models/order';
import { TicketDoc } from '../models/ticket';

export { OrderStatus }

interface CreateOrderAttrs {
  userId: string;
  ticket: TicketDoc;
}

export class OrderService {
  static getOrders(userId: string) {
    return Order.find({ userId }).populate('ticket');
  }

  static async getOrderById(id: string) {
    const order = await Order.findById(id).populate('ticket');
    return order;
  }

  static async getActiveOrder(ticket: TicketDoc) {
    const order = await Order.findOne({
      ticket,
      status: {
        $in: [
          OrderStatus.Created,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
    return order;
  }

  static getExpiresAt() {
    const expiration = new Date();
    expiration.setSeconds(
      expiration.getSeconds() + config.EXPIRATION_WINDOW_SECONDS
    );
    return expiration;
  }

  static async createOrder({ userId, ticket }: CreateOrderAttrs) {
    const doc = Order.build({
      status: OrderStatus.Created,
      userId,
      expiresAt: this.getExpiresAt(),
      ticket,
    });
    await doc.save();
    return doc;
  }

  static async deleteOrder(order: OrderDoc) {
    order.status = OrderStatus.Cancelled;
    await order.save();
    return order
  }

  static async updateOrder(order: OrderDoc, params: Partial<OrderAttrs>) {
    order.set(params);
    await order.save();
    return order;
  }
}
