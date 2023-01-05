import { natsWrapper } from '../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';
import { TicketService } from '../../../services/ticket-service';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@eotickets/common';

const setup = async () => {
  // create a listener instance
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = await TicketService.createTicket({
    userId: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });

  // create a face data event
  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    expiresAt: 'adsad',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    userId: new mongoose.Types.ObjectId().toHexString(),
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
  expect(updatedTicket?.orderId).toEqual(data.id);
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
  console.log(ticket.id);
  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
