import request from 'supertest';
import { app } from '../../app';

const routeName = '/api/tickets';

const createTicket = (cookie: string[]) =>
  request(app).post(routeName).set('Cookie', cookie).send({
    title: 'title 1',
    price: 20,
  });

describe(`APP router`, () => {
  const validBody = {
    title: 'title',
    price: 20,
  };

  let cookie: string[];

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('fetch a list of ticket', async () => {
    await createTicket(cookie)
    await createTicket(cookie)
    await createTicket(cookie)

    const resp = await request(app).get(routeName).send().expect(200)

    expect(resp.body.length).toEqual(3)

  });
});
