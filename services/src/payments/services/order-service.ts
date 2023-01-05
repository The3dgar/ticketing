import { OrderStatus } from '@eotickets/common';

import { Order, OrderDoc, OrderAttrs } from '../models/order';

export { OrderStatus };

export class OrderService {
  static async createOrder(data: OrderAttrs) {
    const doc = Order.build(data);
    await doc.save();
    return doc;
  }
  static async getOrderById(id: string) {
    const order = await Order.findById(id);
    return order;
  }
  static async getOrder(data: Partial<OrderAttrs>) {
    const order = await Order.findOne(data);
    return order;
  }

  static async updateOrder(order: OrderDoc, params: Partial<OrderAttrs>) {
    order.set(params);
    await order.save();
    return order;
  }
}
