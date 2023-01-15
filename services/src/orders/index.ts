import { config } from './config/config';
import { app } from './app';
import { startDbConnection } from './db/dbConnection';
import { natsWrapper } from './events/nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedtedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';

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

  new TicketCreatedListener(natsWrapper.client).listen();
  new TicketUpdatedtedListener(natsWrapper.client).listen();
  new ExpirationCompleteListener(natsWrapper.client).listen();
  new PaymentCreatedListener(natsWrapper.client).listen();

  await startDbConnection(config.MONGODB_URI);
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

start();
