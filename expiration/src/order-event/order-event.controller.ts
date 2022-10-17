import { OrderCreatedEvent, Subjects } from "@hdgticket/common";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";

@Controller("order-event")
export class OrderEventController {
  private logger = new Logger(OrderEventController.name);

  @EventPattern(Subjects.OrderCreated)
  async rcvdOrderCreated(
    @Payload() payload: OrderCreatedEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.debug(
      `rcvd event subject:${ctx.message.subject} payload: ${JSON.stringify(
        payload,
      )}`,
    );
  }
}
