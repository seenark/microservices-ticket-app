import { OrderStatus } from "@hdgticket/common";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MSchema, Types } from "mongoose";
import { Ticket } from "./ticket.schema";

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
  optimisticConcurrency: true,
})
export class Order {
  @Prop({
    type: MSchema.Types.String,
    required: true,
  })
  userId: string;

  @Prop({
    type: MSchema.Types.String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Create,
  })
  status: OrderStatus;

  @Prop({
    type: MSchema.Types.Date,
    required: true,
  })
  expiresAt: Date;

  @Prop({
    type: Types.ObjectId,
    ref: "Ticket",
  })
  ticket: Ticket & { _id: string };

  version: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
OrderSchema.set("versionKey", "version");
