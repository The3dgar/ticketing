import mongoose from 'mongoose';
import { OrderCancelledEvent, OrderStatus } from '@eotickets/common';

import { natsWrapper } from '../../nats-wrapper';
import { TicketService } from '../../../services/ticket-service';
import { OrderCancelledListener } from '../order-cancelled-listener';

const setup = async () => {
  // create a listener instance
  const listener = new OrderCancelledListener(natsWrapper.client);

  const ticket = await TicketService.createTicket({
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
    orderId: new mongoose.Types.ObjectId().toHexString(),
  });

  // create a face data event
  const data: OrderCancelledEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // create a fake msg object 'must have the ack prop'
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return {
    ticket,
    listener,
    data,
    msg,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('sets the userId of the ticket', async () => {
  const { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);

  const updatedTicket = await TicketService.getTicketById(ticket.id);
  expect(updatedTicket?.orderId).toEqual(undefined);
});

it('acks the recieved message', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );
  expect(ticketUpdatedData.orderId).toEqual(undefined);
});
