import { OrderCreatedEvent, OrderStatus } from '@eotickets/common';
import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import mongoose from 'mongoose';
import { OrderService } from '../../../services/order-service';

const setup = async () => {
  // create a listener instance
  const listener = new OrderCreatedListener(natsWrapper.client);

  // create a face data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: 'adsad',
    ticket: {
      id: 'id',
      price: 20,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake msg object 'must have the ack prop'
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    data,
    msg,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('replicates the order info', async () => {
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  const order = await OrderService.getOrderById(data.id);

  expect(order?.price).toEqual(data.ticket.price);
});

it('acks the recieved message', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
