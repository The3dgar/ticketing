import { Publisher, Subjects, OrderCreatedEvent } from '@eotickets/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

// new OrderCreatedPublisher(natsClient).publish({...})