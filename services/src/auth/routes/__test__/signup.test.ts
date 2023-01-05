import request from 'supertest';
import { app } from '../../app';

const routeName = '/api/users/signup';

describe(`POST ${routeName}`, () => {
  it('return 201 on successful', async () => {
    return request(app)
      .post(routeName)
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);
  });

  describe('return 400 on invalid req.body', () => {
    it('return 400 on invalid email', async () => {
      return request(app)
        .post(routeName)
        .send({
          email: 'test',
          password: '123456',
        })
        .expect(400);
    });

    it('return 400 on invalid password', async () => {
      return request(app)
        .post(routeName)
        .send({
          email: 'test@test.com',
          password: '123',
        })
        .expect(400);
    });

    it('return 400 with missing body', async () => {
      return request(app).post(routeName).send({}).expect(400);
    });
  });

  it('return 400 on duplicate emails', async () => {
    await request(app)
      .post(routeName)
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);

    return request(app)
      .post(routeName)
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(400);
  });

  it('set a cookie after successful signup', async () => {
    const response = await request(app)
      .post(routeName)
      .send({
        email: 'test@test.com',
        password: '123456',
      })
      .expect(201);

    expect(response.get("Set-Cookie")).toBeDefined()
    
  });
});
