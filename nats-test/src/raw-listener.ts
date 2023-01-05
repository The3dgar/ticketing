import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
  url: 'http://localhost:4222',
});

// @ts-ignore
stan.on('connect', () => {
  console.log('listener connected to NATS');
  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable() // to get all msg for first time
    .setDurableName('accounting-service');

  stan.on('close', () => {
    console.log('NATS connection closed');
    process.exit();
  });

  const subscription = stan.subscribe(
    'ticket:created',
    'listenerQueueGroup',
    options
  );

  subscription.on('message', (msg: Message) => {
    const data = msg.getData();
    if (typeof data === 'string') {
      console.log('Message recieved #', msg.getSequence());
      console.log('Message recieved data:', JSON.parse(data));
    }

    msg.ack();
  });
});

process.on('SIGINT', () => stan.close());
process.on('SIGTERM', () => stan.close());
