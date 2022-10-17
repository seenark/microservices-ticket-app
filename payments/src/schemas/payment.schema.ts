import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MSchema } from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({
  timestamps: true,
  //   optimisticConcurrency: true,
  versionKey: 'version',
})
export class Payment {
  @Prop({
    type: MSchema.Types.String,
    required: true,
  })
  orderId: string;

  @Prop({
    type: MSchema.Types.String,
    required: true,
  })
  stripeId: string;
  //   version: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
