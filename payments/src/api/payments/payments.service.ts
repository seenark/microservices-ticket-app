import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from 'src/schemas/payment.schema';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  public stripe = new Stripe(process.env.STRIPE_KEY, {
    apiVersion: '2022-08-01',
  });

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  async createPayment(orderId: string, stripeId: string) {
    const payment = new this.paymentModel({
      orderId,
      stripeId,
    });

    return payment.save();
  }
}
