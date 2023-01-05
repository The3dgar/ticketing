const config = {
  TOKEN_KEY: process.env.JWT_SECRET || 'my-secret-key',
  PORT: process.env.PORT || '3000',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/orders',
  EVENT_CLUSTER_ID: process.env.EVENT_CLUSTER_ID || 'ticketing',
  EVENT_CLIENT_ID: process.env.EVENT_CLIENT_ID || 'any',
  EVENT_URL: process.env.EVENT_URL || 'http://nats-srv:4222',
  EXPIRATION_WINDOW_SECONDS: parseInt(
    `${process.env.EXPIRATION_WINDOW_SECONDS || 15 * 60}`
  ),
};

if (!config.TOKEN_KEY) {
  throw new Error('JWT is not defined!');
}

export { config };
