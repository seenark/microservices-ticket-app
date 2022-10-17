import { ExpirationCompleteEvent, Subjects } from "@hdgticket/common";
import { NatsJetStreamClient } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class ExpirationQueueService {
  constructor(private natsClient: NatsJetStreamClient) {}

  async emitExpirationCompleteEvent(orderId: string) {
    const pubAck$ = this.natsClient.emit<ExpirationCompleteEvent["data"]>(
      Subjects.ExpirationComplete,
      {
        orderId: orderId,
      },
    );

    const pubAck = await lastValueFrom(pubAck$);
    return pubAck;
  }
}
