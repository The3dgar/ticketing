import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';

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

  it('return a 400 if the ticket id is not valid', async () => {
    await request(app).get(`${routeName}/badId`).send().expect(400);
  });

  it('return a 400 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app).get(`${routeName}/${id}`).send().expect(404);
  });

  it('return ticket if the ticket is found', async () => {
    const resp = await request(app)
      .post('/api/tickets')
      .set('Cookie', cookie)
      .send(validBody)
      .expect(201);

    const ticket = await request(app)
      .get(`${routeName}/${resp.body.id}`)
      .send()
      .expect(200);
    expect(ticket.body.title).toEqual(validBody.title);
    expect(ticket.body.price).toEqual(validBody.price);
  });
});
