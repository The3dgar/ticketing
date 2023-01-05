import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from '@eotickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
