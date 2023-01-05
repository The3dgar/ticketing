import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { OrderService } from '../../services/order-service';
import { TicketService } from '../../services/ticket-service';
import { natsWrapper } from '../../events/nats-wrapper';

const routeName = '/api/orders';

const createTicketHelper = async () => {
  const ticket = await TicketService.createTicket({
    price: 20,
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  return ticket;
};

describe(`POST ${routeName}`, () => {
  let cookie: string[];
  const ticketId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('return an 404 error if the tkt does not exist', async () => {
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({ ticketId })
      .expect(404);
  });

  it('return an 400 error if the tkt is already reserved not exist', async () => {
    const ticket = await createTicketHelper();
    await OrderService.createOrder({
      ticket,
      userId: 'adsdsada',
    });

    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it('reserves a ticket', async () => {
    const ticket = await createTicketHelper();
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it('emits an order created event', async () => {
    const ticket = await createTicketHelper();
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
