import { config } from './config/config';
import { startDbConnection } from './db/dbConnection';
import { app } from './app';
import { natsWrapper } from './events/nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';

const port = config.PORT;

const start = async () => {
  console.log('Starting...');
  await natsWrapper.connect({
    clusterId: config.EVENT_CLUSTER_ID,
    clientId: config.EVENT_CLIENT_ID,
    url: config.EVENT_URL,
  });

  // this works! but, you know, itsn't pretty :P
  natsWrapper.client.on('close', () => {
    console.error('NATS connection closed');
    process.exit();
  });
  process.on('SIGINT', () => natsWrapper.client.close());
  process.on('SIGTERM', () => natsWrapper.client.close());

  new OrderCreatedListener(natsWrapper.client).listen();
  new OrderCancelledListener(natsWrapper.client).listen();

  await startDbConnection(config.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
