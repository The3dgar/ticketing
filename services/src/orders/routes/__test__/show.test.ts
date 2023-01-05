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

describe(`GET ${routeName}/:orderId`, () => {
  let cookie: string[];
  const ticketId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('fetch the orders', async () => {
    const t1 = await createTicketHelper();

    const user1 = cookie;

    const { body: order } = await request(app)
      .post(routeName)
      .set('Cookie', user1)
      .send({ ticketId: t1.id })
      .expect(201);

    const { body: fetchedOrder } = await request(app)
      .get(`${routeName}/${order.id}`)
      .set('Cookie', user1)
      .expect(200);

    expect(order.id).toEqual(fetchedOrder.id);
  });

  it('throw an error if one user tries to fetch another user order', async () => {
    const t1 = await createTicketHelper();

    const user1 = cookie;
    const user2 = await global.signin();

    const { body: order } = await request(app)
      .post(routeName)
      .set('Cookie', user1)
      .send({ ticketId: t1.id })
      .expect(201);

    await request(app)
      .get(`${routeName}/${order.id}`)
      .set('Cookie', user2)
      .expect(401);
  });
});
