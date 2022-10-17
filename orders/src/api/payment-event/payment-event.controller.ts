import { OrderStatus, PaymentCreatedEvent, Subjects } from "@hdgticket/common";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Controller, Logger, NotFoundException } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { OrdersService } from "../orders/orders.service";

@Controller("payment-event")
export class PaymentEventController {
  logger = new Logger(PaymentEventController.name);
  constructor(private orderService: OrdersService) {}

  @EventPattern(Subjects.PaymentCreated)
  async rcvdPaymentCreated(
    @Payload() payload: PaymentCreatedEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.log("RCVD Payment.Created", payload);

    const order = await this.orderService.getById(payload.orderId);
    if (!order) {
      throw new NotFoundException();
    }

    order.status = OrderStatus.Complete;
    await order.save();

    ctx.message.ack();
  }
}
