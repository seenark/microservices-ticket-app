import {
  OrderCancelledEvent,
  OrderCreatedEvent,
  Subjects,
} from "@hdgticket/common";
import { NatsJetStreamContext } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Controller, NotFoundException } from "@nestjs/common";
import { Ctx, EventPattern, Payload } from "@nestjs/microservices";
import { TicketsService } from "../tickets/tickets.service";
import { TicketsEventService } from "./tickets-event.service";

@Controller("tickets-event")
export class TicketsEventController {
  constructor(
    private ticketService: TicketsService,
    private ticketEventService: TicketsEventService,
  ) {}

  @EventPattern(Subjects.OrderCreated)
  async rcvdOrderCreated(
    @Payload() payload: OrderCreatedEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    // Find the ticket that the order is reserving
    const ticket = await this.ticketService.findById(payload.ticket.id);
    // If no ticket, throw error
    if (!ticket) {
      throw new NotFoundException("ticket not found");
    }
    // Mark the ticket as being reserved by setting its orderId propertyo
    ticket.orderId = payload.id;
    // Save the ticket
    await ticket.save();
    await this.ticketEventService.updateTicket({
      subject: Subjects.TicketUpdated,
      data: {
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
        userId: ticket.userId.toString(),
        orderId: ticket.orderId,
        version: ticket.version,
      },
    });
    // ack the message
    ctx.message.ack();
  }

  @EventPattern(Subjects.OrderCancelled)
  async rcvdOrderCancelled(
    @Payload() payload: OrderCancelledEvent["data"],
    @Ctx() ctx: NatsJetStreamContext,
  ) {
    const ticket = await this.ticketService.findById(payload.ticket.id);
    if (!ticket) {
      throw new NotFoundException("not found ticket");
    }

    ticket.orderId = undefined;
    const newTicket = await ticket.save();
    await this.ticketEventService.updateTicket({
      subject: Subjects.TicketUpdated,
      data: {
        id: newTicket.id,
        price: newTicket.price,
        title: newTicket.title,
        userId: newTicket.userId.toString(),
        orderId: newTicket.orderId,
        version: newTicket.version,
      },
    });

    ctx.message.ack();
  }
}
