import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { TicketService } from '../../services/ticket-service';

const routeName = '/api/tickets';

const firstTicket = {
  title: 'title',
  price: 20,
};

const createTicket = (cookie: string[]) =>
  request(app).post(routeName).set('Cookie', cookie).send(firstTicket);

describe(`APP router`, () => {
  let cookie: string[];

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('returns a 404 if the provided id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`${routeName}`)
      .set('Cookie', cookie)
      .send({ title: 'ticket 1', price: 20 })
      .expect(404);
  });

  it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
      .put(`${routeName}/${id}`)
      // .set('Cookie', cookie)
      .send({ title: 'ticket 1', price: 20 })
      .expect(401);
  });

  it('returns a 401 if the user does not own the ticket', async () => {
    const resp = await createTicket(cookie);

    const newCookie = await global.signin();
    await request(app)
      .put(`${routeName}/${resp.body.id}`)
      .set('Cookie', newCookie)
      .send({ title: 'ticket 2', price: 30 })
      .expect(401);

    // plus: expect that ticket 1 have firstTicket values
    const ticket = await request(app).get(routeName).send().expect(200);
    expect(ticket.body[0].title).toEqual(firstTicket.title);
    expect(ticket.body[0].price).toEqual(firstTicket.price);
  });

  it('returns a 400 if the user provides an invalid title or price', async () => {
    const resp = await createTicket(cookie);
    await request(app)
      .put(`${routeName}/${resp.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'ticket 2' })
      .expect(400);

    await request(app)
      .put(`${routeName}/${resp.body.id}`)
      .set('Cookie', cookie)
      .send({ price: 50 })
      .expect(400);
  });

  it('updates the ticket provided valid inputs', async () => {
    const ticketUpdated = {
      title: 'title 2',
      price: 50,
    };
    const resp = await createTicket(cookie);
    await request(app)
      .put(`${routeName}/${resp.body.id}`)
      .set('Cookie', cookie)
      .send(ticketUpdated)
      .expect(200);

    const ticketResponse = await request(app)
      .get(`${routeName}/${resp.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(ticketUpdated.title);
    expect(ticketResponse.body.price).toEqual(ticketUpdated.price);
  });

  it('reject updates if ticket is reserved', async () => {
    const resp = await createTicket(cookie);

    const ticket = await TicketService.getTicketById(resp.body.id);
    await TicketService.updateTicket(ticket!, {
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });
    await request(app)
      .put(`${routeName}/${resp.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title 2' })
      .expect(400);
  });
});
