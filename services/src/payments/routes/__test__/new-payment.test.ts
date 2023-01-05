import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { OrderService, OrderStatus } from '../../services/order-service';
import { natsWrapper } from '../../events/nats-wrapper';
import { stripe } from '../../services/stripe-service';
import {Payment} from '../../models/payment'
jest.mock('../../services/stripe-service.ts');
const routeName = '/api/payments';

describe(`POST ${routeName}`, () => {
  let cookie: string[];
  const orderId = new mongoose.Types.ObjectId().toHexString();

  beforeEach(async () => {
    cookie = await global.signin();
  });

  it('return an 404 error if the order does not exist', async () => {
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        orderId: new mongoose.Types.ObjectId().toHexString(),
        token: 'asd',
      })
      .expect(404);
  });

  it('return an 401 error if the order that does not bellow to the user', async () => {
    const order = await OrderService.createOrder({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        orderId: order.id,
        token: 'asd',
      })
      .expect(401);
  });

  it('return an 400 error if its a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await OrderService.createOrder({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Cancelled,
    });

    const cookie = await global.signinCustom(userId);
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        orderId: order.id,
        token: 'asd',
      })
      .expect(400);
  });

  it('returns a 204 with a valid inputs', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = await OrderService.createOrder({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId,
      version: 0,
      price: 20,
      status: OrderStatus.Created,
    });

    const cookie = await global.signinCustom(userId);
    await request(app)
      .post(routeName)
      .set('Cookie', cookie)
      .send({
        orderId: order.id,
        token: 'tok_visa',
      })
      .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(order.price * 100);
    expect(chargeOptions.currency).toEqual('usd');
    
    const payment = await Payment.findOne({
      orderId: order.id
    })
    // expect()
  });
});
