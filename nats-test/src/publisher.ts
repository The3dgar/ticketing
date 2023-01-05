import nats from 'node-nats-streaming';
import { TicketCreatePublisher } from './events/ticket-created-publisher';

console.clear();
const client = nats.connect('ticketing', 'publisher', {
  url: 'http://localhost:4222',
});

// @ts-ignore
client.on('connect', async () => {
  console.log('publisher connected to NATS');

  // const data = JSON.stringify({
  //   id: '123',
  //   title: 'concert',
  //   price: 20,
  // });

  // client.publish('ticket:created', data, (err, guid) => {
  //   console.log('Event published guid:',guid);
  // });

  // refactor
  const publisher = new TicketCreatePublisher(client);
  try {
    await publisher.publish({
      id: '123',
      price: 20,
      title: 'concert',
    });
  } catch (error) {
    console.log(error);
  }
});
