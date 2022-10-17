import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Schema as MSchema, Types } from "mongoose";

export type TicketDocument = Ticket & Document;

@Schema({
  timestamps: true,
  optimisticConcurrency: true,
})
export class Ticket {
  @Prop({
    type: MSchema.Types.String,
    required: true,
    index: true,
  })
  title: string;

  @Prop({
    type: MSchema.Types.Number,
    required: true,
  })
  price: number;

  @Prop({
    type: MSchema.Types.ObjectId,
    required: true,
  })
  userId: Types.ObjectId;

  @Prop({
    type: MSchema.Types.String,
  })
  orderId: string;

  version: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
TicketSchema.set("versionKey", "version");
