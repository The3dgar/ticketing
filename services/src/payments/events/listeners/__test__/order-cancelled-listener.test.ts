import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  OrderStatus,
} from '@eotickets/common';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { OrderService } from '../../../services/order-service';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  // create a listener instance
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = await OrderService.createOrder({
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 10,
  });

  // create a face data event
  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: 1,
    ticket: {
      id: 'id',
    },
  };

  // create a fake msg object 'must have the ack prop'
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    order,
    listener,
    data,
    msg,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('update order status', async () => {
  const { data, msg, listener, order } = await setup();
  await listener.onMessage(data, msg);

  const orderUpdated = await OrderService.getOrderById(data.id);

  expect(orderUpdated?.status).toEqual(OrderStatus.Cancelled);
});

it('acks the recieved message', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
