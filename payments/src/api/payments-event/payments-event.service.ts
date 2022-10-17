import { PaymentCreatedEvent, Subjects } from '@hdgticket/common';
import { NatsJetStreamClient } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class PaymentsEventService {
  constructor(private natsClient: NatsJetStreamClient) {}
  async sentPaymentCreatedEvent(data: PaymentCreatedEvent['data']) {
    const puback$ = this.natsClient.emit(Subjects.PaymentCreated, data);
    return lastValueFrom(puback$);
  }
}
