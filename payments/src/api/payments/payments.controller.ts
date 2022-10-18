import {
  JwtAuthGuard,
  OrderStatus,
  TUserData,
  UserData,
} from '@hdgticket/common';
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from '../order/order.service';
import { PaymentsEventService } from '../payments-event/payments-event.service';
import { PaymentsService } from './payments.service';

interface ICreateCharge {
  token: string;
  orderId: string;
}

@Controller('api/payments')
export class PaymentsController {
  logger = new Logger(PaymentsController.name);
  constructor(
    private paymentService: PaymentsService,
    private orderService: OrderService,
    private paymentEventService: PaymentsEventService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createCharge(
    @UserData() userData: TUserData,
    @Body() body: ICreateCharge,
  ) {
    const order = await this.orderService.findByOrderId(body.orderId);

    if (order.userId.toString() !== userData.id) {
      throw new UnauthorizedException();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestException({
        message: 'can not pay for a cancelled order',
      });
    }

    // const charge = await this.paymentService.stripe.charges.create({
    //   currency: 'usd',
    //   amount: order.price * 100,
    //   source: body.token,
    // });

    const paymentIntent =
      await this.paymentService.stripe.paymentIntents.create({
        amount: order.price * 100,
        currency: 'usd',
        description: `buy $${order.id}`,
        payment_method: body.token,
        confirm: true,
      });

    const payment = await this.paymentService.createPayment(
      body.orderId,
      paymentIntent.id,
    );
    this.logger.log('saved payment');

    await this.paymentEventService.sentPaymentCreatedEvent({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    return { id: payment.id };
  }
}
