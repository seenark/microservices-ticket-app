import {
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@hdgticket/common";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Controller, Logger } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { Types } from "mongoose";
import { TicketsService } from "./tickets.service";

@Controller("tickets")
export class TicketsController {
  private logger = new Logger(TicketsController.name);

  constructor(private ticketService: TicketsService) {}

  @EventPattern(Subjects.TicketCreated)
  rcvdTicketCreated(
    @Payload() payload: TicketCreatedEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.debug(
      `RCVD event: ${ctx.message.subject}, payload: ${JSON.stringify(payload)}`,
    );
    this.logger.debug(`seq: ${ctx.message.seq}`);
    const id = new Types.ObjectId(payload.id);
    this.ticketService.create(id, payload.title, payload.price);
    ctx.message.ack();
  }

  @EventPattern(Subjects.TicketUpdated)
  rcvdTicketUpdated(
    @Payload() payload: TicketUpdatedEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    this.logger.debug(
      `RCVD event: ${ctx.message.subject}, payload: ${JSON.stringify(payload)}`,
    );
    this.logger.debug(`seq: ${ctx.message.seq}`);
    try {
      this.ticketService.update(
        payload.id,
        payload.title,
        payload.price,
        payload.version,
      );
      ctx.message.ack();
    } catch (error) {
      this.logger.debug("Count not update Ticket due to", error);
    }
  }
}
