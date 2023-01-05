import request from 'supertest';
import { app } from '../../app';

const routeName = '/api/users/signout';
const signupRoute = '/api/users/signup';

describe(`POST ${routeName}`, () => {
  const validBody = {
    email: 'test@test.com',
    password: '123456',
  };

  it('clear the cookie after signout', async () => {
    await request(app).post(signupRoute).send(validBody).expect(201);

    const resp = await request(app).post(routeName).send({}).expect(200);
    expect(resp.get('Set-Cookie')[0]).toEqual(
      'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    );
  });
});
