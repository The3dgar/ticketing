import { config } from './config/config';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './events/nats-wrapper';

const start = async () => {
  console.log('Starting...');
  try {
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

    new OrderCreatedListener(natsWrapper.client).listen();

    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    console.log(`Expiration is running`);
  } catch (error) {
    console.error(error);
  }
};

start();
