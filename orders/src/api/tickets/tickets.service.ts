import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Ticket, TicketDocument } from "src/schemas/ticket.schema";

@Injectable()
export class TicketsService {
  logger = new Logger(TicketsService.name);
  constructor(
    @InjectModel(Ticket.name) private ticketModel: Model<TicketDocument>,
  ) {}

  async getAll() {
    return this.ticketModel.find();
  }

  async create(id: Types.ObjectId, title: string, price: number) {
    const ticket = new this.ticketModel({ title, price, _id: id });
    const saved = await ticket.save();
    return saved;
  }

  async update(id: string, title: string, price: number, version: number) {
    // const ticket = await this.getTicketById(id);
    this.logger.debug(`id: ${id}, version: ${version}`);
    const ticket = await this.ticketModel.findOne({ id, version: version - 1 });
    this.logger.debug(ticket);
    if (!ticket) {
      throw new NotFoundException({ message: "not found ticket" });
    }
    ticket.title = title;
    ticket.price = price;
    ticket.updatedOn = new Date().toISOString();
    return ticket.save();
  }

  async delete(id: string) {
    return this.ticketModel.deleteOne({ _id: id });
  }

  async getTicketById(ticketId: string) {
    return this.ticketModel.findById(ticketId);
  }
}
