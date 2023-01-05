import { TicketUpdatedEvent } from '@eotickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketService } from '../../../services/ticket-service';
import { natsWrapper } from '../../nats-wrapper';
import { TicketUpdatedtedListener } from '../ticket-updated-listener';

const setup = async () => {
  // create a listener instance
  const listener = new TicketUpdatedtedListener(natsWrapper.client);

  // create and save a ticket

  const ticket = await TicketService.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });

  // create a face data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    price: 99,
    title: 'new title',
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
    ticket,
    msg,
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

it('finds. updates, and saves a ticket', async () => {
  // call the onMesg function with data + msg
  const { data, msg, listener, ticket } = await setup();
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created
  const updatedTicket = await TicketService.getTicketById(ticket.id);
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it('acks the recieved message', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});

it('does not acks if the event has a skipped version number', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  data.version = 20;

  // write assertions to make sure ack function is called
  try {
    await listener.onMessage(data, msg);
  } catch (error) {}
  expect(msg.ack).not.toHaveBeenCalled();
});
