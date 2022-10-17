import {
  NatsJetStreamTransport,
  NatsJetStreamClientOptions,
  NatsJetStreamClient,
} from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TEnv, validateEnv } from "./env.validate";
import { OrderEventController } from "./order-event/order-event.controller";
import { ExpirationQueueController } from "./expiration-queue/expiration-queue.controller";
import { ExpirationQueueProcess } from "./expiration-queue/expiration-queue.process";
import { BullModule, BullRootModuleOptions } from "@nestjs/bull";
import { ExpirationQueueService } from './expiration-queue/expiration-queue.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./.env",
      validate: validateEnv,
    }),
    NatsJetStreamTransport.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        const clientOptions: NatsJetStreamClientOptions = {
          connectionOptions: {
            servers: configService.get("NATS_URL"),
            name: "ticket-client",
          },
        };
        return clientOptions;
      },
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        const options: BullRootModuleOptions = {
          redis: {
            host: configService.get("REDIS_HOST"),
            port: 6379,
          },
        };
        return options;
      },
    }),
    BullModule.registerQueue({ name: "expiration-queue" }),
  ],
  controllers: [AppController, OrderEventController, ExpirationQueueController],
  providers: [AppService, NatsJetStreamClient, ExpirationQueueProcess, ExpirationQueueService],
})
export class AppModule {}
