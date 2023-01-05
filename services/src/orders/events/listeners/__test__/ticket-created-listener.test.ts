import { TicketCreatedEvent } from '@eotickets/common';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { TicketService } from '../../../services/ticket-service';
import { natsWrapper } from '../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const setup = async () => {
  // create a listener instance
  const listener = new TicketCreatedListener(natsWrapper.client);

  // create a face data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
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

it('create and saves a ticket', async () => {
  // call the onMesg function with data + msg
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);
  // write assertions to make sure a ticket was created
  const ticket = await TicketService.getTicketById(data.id);
  expect(ticket).toBeDefined();
  expect(ticket?.title).toEqual(data.title);
  expect(ticket?.price).toEqual(data.price);
});

it('acks the recieved message', async () => {
  // the same up
  const { data, msg, listener } = await setup();
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
