import { OrderCreatedEvent, Subjects } from "@hdgticket/common";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { InjectQueue } from "@nestjs/bull";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Queue } from "bull";
import { IExpirationQueuePayload } from "./payload";

@Controller("expiration-queue")
export class ExpirationQueueController {
  private logger = new Logger(ExpirationQueueController.name);
  constructor(
    @InjectQueue("expiration-queue")
    private readonly expirationQueue: Queue<IExpirationQueuePayload>,
  ) {}

  @EventPattern(Subjects.OrderCreated)
  async rcvdOrderCreated(
    @Payload() payload: OrderCreatedEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.debug(
      `rcvd event subject: ${ctx.message.subject} payload: ${JSON.stringify(
        payload,
      )}`,
    );
    const delay = new Date(payload.expiresAt).getTime() - new Date().getTime();
    console.log("delay", delay);
    const job = await this.expirationQueue.add(
      {
        orderId: payload.id,
      },
      {
        delay: delay,
      },
    );
    this.logger.debug(`create jobs ${JSON.stringify(job)}`);

    ctx.message.ack();
  }
}
