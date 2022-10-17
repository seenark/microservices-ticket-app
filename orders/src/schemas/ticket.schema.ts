import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Schema as MSchema } from "mongoose";

export type TicketDocument = Ticket & Document;

@Schema({
  timestamps: true,
  optimisticConcurrency: true,
  versionKey: "version",
})
export class Ticket {
  @Prop({
    type: MSchema.Types.String,
    required: true,
  })
  title: string;

  @Prop({
    type: MSchema.Types.Number,
    required: true,
  })
  price: number;

  @Prop({
    type: MSchema.Types.String,
  })
  updatedOn: string;

  version: number;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);
// TicketSchema.set("versionKey", "version");
