import {
  NatsJetStreamTransport,
  NatsJetStreamClientOptions,
  NatsJetStreamClient,
} from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TEnv, validateEnv } from './env.validate';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderEventController } from './api/order-event/order-event.controller';
import { OrderEventService } from './api/order-event/order-event.service';
import { OrderController } from './api/order/order.controller';
import { OrderService } from './api/order/order.service';
import { PaymentsController } from './api/payments/payments.controller';
import { PaymentsService } from './api/payments/payments.service';
import { JwtStrategy } from '@hdgticket/common';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentsEventService } from './api/payments-event/payments-event.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<TEnv>) => {
        return {
          uri: configService.get('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Payment.name,
        schema: PaymentSchema,
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        console.log('secret', configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '15m',
          },
        };
      },
    }),

    NatsJetStreamTransport.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        const clientOptions: NatsJetStreamClientOptions = {
          connectionOptions: {
            servers: configService.get('NATS_URL'),
            name: 'ticket-client',
          },
        };
        return clientOptions;
      },
    }),
  ],
  controllers: [
    AppController,
    OrderEventController,
    OrderController,
    PaymentsController,
  ],
  providers: [
    AppService,
    OrderEventService,
    OrderService,
    PaymentsService,
    JwtStrategy,
    NatsJetStreamClient,
    PaymentsEventService,
  ],
})
export class AppModule {}
