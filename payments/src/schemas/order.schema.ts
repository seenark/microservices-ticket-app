import { OrderStatus } from '@hdgticket/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MSchema, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({
  timestamps: true,
  optimisticConcurrency: true,
  versionKey: 'version',
})
export class Order {
  @Prop({
    type: MSchema.Types.String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Complete,
  })
  status: OrderStatus;

  @Prop({
    type: MSchema.Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: MSchema.Types.Number,
  })
  price: number;

  version: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
// OrderSchema.set("versionKey", "version");
