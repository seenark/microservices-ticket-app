import {
  Subjects,
  TicketCreatedEvent,
  TicketUpdatedEvent,
} from "@hdgticket/common";
import { NatsJetStreamClient } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { lastValueFrom } from "rxjs";
import { Ticket, TicketDocument } from "src/schemas/ticket.schema";

@Injectable()
export class TicketsService {
  logger = new Logger(TicketsService.name);
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
    private natsClient: NatsJetStreamClient,
  ) {}

  async create(title: string, price: number, userId: string) {
    const newTicket = new this.ticketModel({
      title: title,
      price: price,
      userId: userId,
    });

    const ticketCreatedEvent: TicketCreatedEvent = {
      subject: Subjects.TicketCreated,
      data: {
        id: newTicket.id,
        price: newTicket.price,
        title: newTicket.title,
        userId: newTicket.userId.toString(),
        version: newTicket.version,
      },
    };
    const pub$ = this.natsClient.emit(
      ticketCreatedEvent.subject,
      ticketCreatedEvent.data,
    );
    const pubAck = await lastValueFrom(pub$);
    this.logger.log(
      `published ${ticketCreatedEvent} ${pubAck.seq} to stream ${pubAck.stream}`,
    );

    return newTicket.save();
  }

  async update(id: string, title: string, price: number, userId: string) {
    const ticket = await this.findById(id);
    if (!ticket) {
      throw new NotFoundException();
    }
    if (ticket.userId.toHexString() != userId) {
      throw new UnauthorizedException("You are not own this ticket");
    }
    if (ticket.orderId) {
      throw new BadRequestException("Cannot edit reserved ticket");
    }
    ticket.title = title;
    ticket.price = price;
    const saved = await ticket.save();
    const updateEvent: TicketUpdatedEvent = {
      subject: Subjects.TicketUpdated,
      data: {
        id: id,
        price: saved.price,
        title: saved.title,
        userId: saved.userId.toString(),
        version: saved.version,
      },
    };
    const pub$ = this.natsClient.emit(updateEvent.subject, updateEvent.data);
    const pubAck = await lastValueFrom(pub$);
    this.logger.log(
      `published ${updateEvent} ${pubAck.seq} to stream ${pubAck.stream}`,
    );
    return saved;
  }

  async findAll() {
    return this.ticketModel.find();
  }

  async findById(id: string) {
    return this.ticketModel.findById(id);
  }
}
