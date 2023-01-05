import request from 'supertest';
import { app } from '../../app';

const routeName = '/api/users/signin';
const signupRoute = '/api/users/signup';

describe(`POST ${routeName}`, () => {
  const validBody = {
    email: 'test@test.com',
    password: '123456',
  };

  it('return 400 when a email that does not exist', async () => {
    return request(app).post(routeName).send(validBody).expect(400);
  });

  it('return 400 when password does not match', async () => {
    await request(app).post(signupRoute).send(validBody).expect(201);

    return request(app)
      .post(routeName)
      .send({ ...validBody, password: '111111' })
      .expect(400);
  });

  it('return 200 when signin successful', async () => {
    await request(app).post(signupRoute).send(validBody).expect(201);

    return request(app).post(routeName).send(validBody).expect(200);
  });

  it('set a cookie after successful signup', async () => {
    await request(app).post(signupRoute).send(validBody).expect(201);
    const response = await request(app)
      .post(routeName)
      .send(validBody)
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});
