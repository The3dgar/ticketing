import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';

import { TicketService } from '../../services/ticket-service';
import { OrderService, OrderStatus } from '../../services/order-service';
import { natsWrapper } from '../../events/nats-wrapper';

const createTicketHelper = async () => {
  const ticket = await TicketService.createTicket({
    price: 20,
    title: 'concert',
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  return ticket;
};

const routeName = '/api/orders';

describe(`DELETE ${routeName}/:orderId`, () => {
  let cookie: string[];
  const ticketId = new mongoose.Types.ObjectId();

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('marks an order as cancelled', async () => {
    const t1 = await createTicketHelper();

    const user1 = cookie;

    const { body: order } = await request(app)
      .post(routeName)
      .set('Cookie', user1)
      .send({ ticketId: t1.id })
      .expect(201);

    await request(app)
      .delete(`${routeName}/${order.id}`)
      .set('Cookie', user1)
      .expect(204);

    const updatedOrder = await OrderService.getOrderById(order.id);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('emits an order cancelled event', async () => {
    const t1 = await createTicketHelper();

    const user1 = cookie;

    const { body: order } = await request(app)
      .post(routeName)
      .set('Cookie', user1)
      .send({ ticketId: t1.id })
      .expect(201);

    await request(app)
      .delete(`${routeName}/${order.id}`)
      .set('Cookie', user1)
      .expect(204);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
