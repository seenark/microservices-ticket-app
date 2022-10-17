import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from "@hdgticket/common";
import { NatsJetStreamClient } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Injectable, Logger } from "@nestjs/common";
import { lastValueFrom } from "rxjs";

@Injectable()
export class OrdersEventService {
  private logger = new Logger(OrdersEventService.name);
  constructor(private natsClient: NatsJetStreamClient) {}

  async emitOrderCreatedEvent(data: OrderCreatedEvent["data"]) {
    const pubAck$ = this.natsClient.emit<OrderCreatedEvent["data"]>(
      Subjects.OrderCreated,
      data,
    );
    const pubAck = await lastValueFrom(pubAck$);
    this.logger.debug(`order created seq: ${pubAck.seq}`);
    return pubAck;
  }

  async emitOrderCancelledEvent(data: OrderCancelledEvent["data"]) {
    const pubAck$ = this.natsClient.emit<OrderCancelledEvent["data"]>(
      Subjects.OrderCancelled,
      data,
    );
    const pubAck = await lastValueFrom(pubAck$);
    this.logger.debug(`order cancelled seq: ${pubAck.seq}`);
    return pubAck;
  }
}
