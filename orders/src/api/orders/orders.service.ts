import { OrderStatus } from "@hdgticket/common";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { Order, OrderDocument } from "src/schemas/order.schema";
import { TicketDocument } from "src/schemas/ticket.schema";

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async getAll(userId: string) {
    const orders = await this.orderModel
      .find({ userId: userId })
      .populate("ticket");
    return orders;
  }

  async getById(id: string) {
    const order = await this.orderModel.findById(id).populate("ticket");
    return order;
  }

  async create(
    userId: string,
    status: OrderStatus,
    expiresAt: Date,
    ticket: TicketDocument,
  ) {
    const order = new this.orderModel({
      userId: userId,
      expiresAt,
      status,
      ticket,
    });

    const newOrder = await order.save();
    return newOrder;
  }

  async update(id: string, status: OrderStatus, expiresAt: Date) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException({ message: "Not found" });
    }

    order.status = status;
    order.expiresAt = expiresAt;
    const updated = await order.save();
    return updated;
  }

  async updateStatus(id: string, status: OrderStatus) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException({ message: "Not found" });
    }
    order.status = status;
    const updated = await order.save();
    return updated;
  }

  async isReserved(ticketId: Types.ObjectId): Promise<boolean> {
    const order = await this.orderModel.findOne({
      ticket: ticketId,
      status: {
        $in: [
          OrderStatus.Create,
          OrderStatus.AwaitingPayment,
          OrderStatus.Complete,
        ],
      },
    });
    const logger = new Logger(this.isReserved.name);
    logger.debug(order);
    logger.debug(`is reserved: ${!!order}`);
    return !!order;
  }
}
