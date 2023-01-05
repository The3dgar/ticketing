import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ExpirationCompleteEvent, OrderStatus } from '@eotickets/common';

import { ExpirationCompleteListener } from '../expiration-complete-listener';
import { OrderService } from '../../../services/order-service';
import { TicketService } from '../../../services/ticket-service';
import { natsWrapper } from '../../nats-wrapper';


const setup = async () => {
  // create a listener instance
  const listener = new ExpirationCompleteListener(natsWrapper.client);

  // create a ticket
  const ticket = await TicketService.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert'
  })

  const order = await OrderService.createOrder({
    userId: '123',
    ticket: ticket.id
  })

  // create a face data event
  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id
  };

  // create a fake msg object 'must have the ack prop'
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    listener,
    order,
    ticket,
    data,
    msg,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('update the order status to cancel', async () => {
  const { data, msg, listener, order } = await setup();
  await listener.onMessage(data, msg);
  
  const updatedOrder = await OrderService.getOrderById(order.id)
  expect(updatedOrder?.status).toEqual(OrderStatus.Cancelled)
});

it('emit an OrderCancelled event', async ()=> {
  const { data, msg, listener, order } = await setup();
  await listener.onMessage(data, msg);
  expect(natsWrapper.client.publish).toHaveBeenCalled()

  // remember that the [0] is the subject
  const eventData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
  expect(eventData.id).toEqual(order.id)
})

it('acks the recieved message', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
