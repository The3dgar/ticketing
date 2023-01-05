const config = {
  EVENT_CLUSTER_ID: process.env.EVENT_CLUSTER_ID || 'ticketing',
  EVENT_CLIENT_ID: process.env.EVENT_CLIENT_ID || 'any',
  EVENT_URL: process.env.EVENT_URL || 'http://nats-srv:4222'
};

export { config };