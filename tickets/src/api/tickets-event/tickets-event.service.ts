import { TicketUpdatedEvent } from "@hdgticket/common";
import { NatsJetStreamClient } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class TicketsEventService {
  constructor(private natsClient: NatsJetStreamClient) {}

  async updateTicket(event: TicketUpdatedEvent) {
    const pubAck$ = this.natsClient.emit(event.subject, event.data);
    const pubAck = await lastValueFrom(pubAck$);
    return pubAck;
  }
}
