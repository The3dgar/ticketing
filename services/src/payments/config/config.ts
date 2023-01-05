const config = {
  TOKEN_KEY: process.env.JWT_SECRET || "my-secret-key",
  PORT: process.env.PORT || "3000",
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/payments',
  EVENT_CLUSTER_ID: process.env.EVENT_CLUSTER_ID || 'ticketing',
  EVENT_CLIENT_ID: process.env.EVENT_CLIENT_ID || 'any',
  EVENT_URL: process.env.EVENT_URL || 'http://nats-srv:4222',
  STRIPE_API_KEY: process.env.STRIPE_SECRET!,
};

if (!config.TOKEN_KEY) {
  throw new Error('JWT is not defined!');
}

export { config };