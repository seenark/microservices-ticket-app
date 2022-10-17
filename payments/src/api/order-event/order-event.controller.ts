import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from '@hdgticket/common';
import { NatsJetStreamContext } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Controller, Logger } from '@nestjs/common';
import { Ctx, EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from '../order/order.service';

@Controller('order-event')
export class OrderEventController {
  logger = new Logger(OrderEventController.name);
  constructor(private orderService: OrderService) {}

  @EventPattern(Subjects.OrderCreated)
  async rcvdOrderCreated(
    @Payload() payload: OrderCreatedEvent['data'],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.log(`rcvd event: ${ctx.message.subject}`);
    this.logger.log('data is ', payload);
    await this.orderService.create(
      payload.id,
      payload.status,
      payload.version,
      payload.userId,
      payload.ticket.price,
    );

    ctx.message.ack();
  }

  @EventPattern(Subjects.OrderCancelled)
  async rcvdOrderCancelled(
    @Payload() payload: OrderCancelledEvent['data'],
    ctx: NatsJetStreamContext,
  ) {
    this.logger.log(`rcvd event: ${ctx.message.subject}`);
    this.logger.log('data', payload);

    await this.orderService.findByOrderIdAndVersion(
      payload.id,
      payload.version - 1,
    );
    ctx.message.ack();
  }
}
