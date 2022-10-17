import {
  ExpirationCompleteEvent,
  OrderStatus,
  Subjects,
} from "@hdgticket/common";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { BadRequestException, Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { OrdersEventService } from "../orders-event/orders-event.service";
import { OrdersService } from "../orders/orders.service";

@Controller("expiration-queue")
export class ExpirationQueueController {
  private logger = new Logger(ExpirationQueueController.name);
  constructor(
    private orderService: OrdersService,
    private orderEventService: OrdersEventService,
  ) {}

  @EventPattern(Subjects.ExpirationComplete)
  async rcvdExpirationComplete(
    @Payload() payload: ExpirationCompleteEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.log("RCVD Expireation queue");
    const order = await this.orderService.getById(payload.orderId);
    if (!order) {
      throw new BadRequestException("Order not found");
    }
    if (order.status === OrderStatus.Complete) {
      return ctx.message.ack();
    }

    order.status = OrderStatus.Cancelled;

    const newOrder = await order.save();

    await this.orderEventService.emitOrderCancelledEvent({
      id: newOrder.id,
      ticket: {
        id: newOrder.ticket._id,
      },
      version: newOrder.version,
    });

    ctx.message.ack();
  }
}
