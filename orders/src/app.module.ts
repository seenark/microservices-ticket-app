import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { OrdersController } from "./api/orders/orders.controller";
import { OrdersService } from "./api/orders/orders.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TEnv, validateEnv } from "./env.validate";
import { MongooseModule, MongooseModuleOptions } from "@nestjs/mongoose";
import { Order, OrderSchema } from "./schemas/order.schema";
import { PassportModule } from "@nestjs/passport";
import { JwtModule, JwtModuleOptions } from "@nestjs/jwt";
import {
  NatsJetStreamClient,
  NatsJetStreamClientOptions,
  NatsJetStreamTransport,
} from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { JwtStrategy } from "@hdgticket/common";
import { Ticket, TicketSchema } from "./schemas/ticket.schema";
import { TicketsService } from "./api/tickets/tickets.service";
import { OrdersEventService } from "./api/orders-event/orders-event.service";
import { TicketsController } from "./api/tickets/tickets.controller";
import { ExpirationQueueController } from "./api/expiration-queue/expiration-queue.controller";
import { PaymentEventController } from './api/payment-event/payment-event.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./.env",
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<TEnv>) => {
        const mongooseModuleOptions: MongooseModuleOptions = {
          uri: configService.get("MONGO_URI"),
        };
        return mongooseModuleOptions;
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Order.name,
        schema: OrderSchema,
      },
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        const jwtModuleOptions: JwtModuleOptions = {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: "15m",
          },
        };
        return jwtModuleOptions;
      },
    }),
    NatsJetStreamTransport.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        const clientOptions: NatsJetStreamClientOptions = {
          connectionOptions: {
            servers: [configService.get("NATS_URL")],
            name: configService.get("NATS_CLIENT_ID"),
          },
        };
        return clientOptions;
      },
    }),
  ],
  controllers: [
    AppController,
    OrdersController,
    TicketsController,
    ExpirationQueueController,
    PaymentEventController,
  ],
  providers: [
    AppService,
    OrdersService,
    JwtStrategy,
    NatsJetStreamClient,
    TicketsService,
    OrdersEventService,
  ],
})
export class AppModule {}
