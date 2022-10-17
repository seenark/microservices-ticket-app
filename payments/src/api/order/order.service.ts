import { OrderStatus } from '@hdgticket/common';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/order.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(
    id: string,
    status: OrderStatus,
    version: number,
    userId: string,
    price: number,
  ) {
    const order = new this.orderModel({
      _id: id,
      price: price,
      status,
      userId,
      version,
    });
    return order.save();
  }

  async findByOrderIdAndVersion(id: string, version: number) {
    const order = await this.orderModel.findOne({
      _id: id,
      version: version,
    });

    if (!order) {
      throw new NotFoundException({
        message: `not found order id: ${id} and version ${version}`,
      });
    }

    order.status = OrderStatus.Cancelled;
    return order.save();
  }

  async findByOrderId(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException();
    }
    return order;
  }
}
