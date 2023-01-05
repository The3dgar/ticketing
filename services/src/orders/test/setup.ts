import { TokenService } from '@eotickets/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: () => Promise<string[]>;
}

let mongo: MongoMemoryServer;

jest.mock('../events/nats-wrapper.ts');

beforeAll(async () => {
  process.env.JWT_SECRET = 'my_seckre_key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  collections.map(async (c) => await c.deleteMany({}));
});

afterAll(async () => {
  if (mongo) await mongo.stop();
  await mongoose.connection.close();
});

// to create a cookie
global.signin = async () => {
  // Build a JWT {id, email}
  const payload = {
    id: new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
  };

  // create jwt!
  const jwt = await TokenService.generate(payload);

  // build session obj {jwt: "adssa"}
  const session = { jwt };

  // turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with encode data
  return [`session=${base64}`];
};
