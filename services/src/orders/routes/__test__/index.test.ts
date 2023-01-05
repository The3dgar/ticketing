import request from 'supertest';
import { app } from '../../app';
import { TicketService } from '../../services/ticket-service';
import mongoose from 'mongoose';

const createTicketHelper = async () => {
  const ticket = await TicketService.createTicket({
    id: new mongoose.Types.ObjectId().toHexString(),
    price: 20,
    title: 'concert',
  });
  return ticket;
};

const routeName = '/api/orders';

describe(`GET ${routeName}`, () => {
  let cookie: string[];
  const ticketId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('fetch orders for a particular user', async () => {
    const t1 = await createTicketHelper();
    const t2 = await createTicketHelper();
    const t3 = await createTicketHelper();

    const user1 = cookie;
    const user2 = await global.signin();

    await request(app)
      .post(routeName)
      .set('Cookie', user1)
      .send({ ticketId: t1.id })
      .expect(201);

    const { body: order1 } = await request(app)
      .post(routeName)
      .set('Cookie', user2)
      .send({ ticketId: t2.id })
      .expect(201);

    const { body: order2 } = await request(app)
      .post(routeName)
      .set('Cookie', user2)
      .send({ ticketId: t3.id })
      .expect(201);

    const response = await request(app)
      .get(routeName)
      .set('Cookie', user2)
      .expect(200);

    expect(response.body).toHaveLength(2);
    expect(response.body[0].id).toBe(order1.id);
    expect(response.body[0].ticket.id).toBe(t2.id);
    expect(response.body[1].id).toBe(order2.id);
    expect(response.body[1].ticket.id).toBe(t3.id);
  });
});
