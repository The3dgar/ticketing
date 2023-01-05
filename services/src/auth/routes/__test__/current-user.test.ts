import request from 'supertest';
import { app } from '../../app';
import { currentUserRoute } from '../current-user';

const routeName = currentUserRoute;
describe(`GET ${routeName}`, () => {
  const validBody = {
    email: 'test@test.com',
    password: '123456',
  };

  it('response { currentUser : null } when user is not log in ', async () => {
    const resp = await request(app).get(routeName).expect(200);
    expect(resp.body).toEqual({ currentUser: null });
  });

  it('response details about current user', async () => {
    // change this to global prop
    // const authResp = await request(app)
    //   .post(signupRoute)
    //   .send(validBody)
    //   .expect(201);

    // const cookie = authResp.get('Set-Cookie');

    const cookie = await global.signin();

    const resp = await request(app)
      .get(routeName)
      .set('Cookie', cookie)
      .expect(200);

    expect(resp.body.currentUser.email).toEqual(validBody.email);
  });

  it('responds with null if not authenticated', async () => {
    const response = await request(app)
      .get(currentUserRoute)
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull()
  });
});
