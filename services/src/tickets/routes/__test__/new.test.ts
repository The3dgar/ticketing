import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../events/nats-wrapper';

const routeName = '/api/tickets';

describe(`POST ${routeName}`, () => {
  const validBody = {
    title: 'title',
    price: 20,
  };

  let cookie: string[];

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('has a route for post request', async () => {
    const response = await request(app).post(routeName).send({});
    expect(response.statusCode).not.toEqual(404);
  });

  it('can only be accessed if the user is signed in', async () => {
    const response = await request(app).post(routeName).send({});
    expect(response.statusCode).toEqual(401);
  });

  it('returns a status other than 401 if user is signed in', async () => {
    const response = await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({});
    expect(response.statusCode).not.toEqual(401);
  });

  it('return error if invalid title is provided', async () => {
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        title: '',
        price: 10,
      })
      .expect(400);

    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        price: 10,
      })
      .expect(400);
  });

  it('return error if invalid price is provided', async () => {
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        title: 'title',
        price: -10,
      })
      .expect(400);

    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        title: 'title',
      })
      .expect(400);
  });

  it('creates a tickets with valid inputs', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send(validBody)
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(validBody.price);
  });

  it('publishes an event', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(validBody)
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});
