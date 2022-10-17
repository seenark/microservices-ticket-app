import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TEnv, validateEnv } from "./env.validate";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { TicketsController } from "./api/tickets/tickets.controller";
import { TicketsService } from "./api/tickets/tickets.service";
import { JwtStrategy } from "@hdgticket/common";
import { Ticket, TicketSchema } from "./schemas/ticket.schema";
import { PassportModule } from "@nestjs/passport";
import {
  NatsJetStreamClient,
  NatsJetStreamClientOptions,
  NatsJetStreamTransport,
} from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { TicketsEventController } from "./api/tickets-event/tickets-event.controller";
import { TicketsEventService } from "./api/tickets-event/tickets-event.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./.env",
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService<TEnv>) => {
        return {
          uri: configService.get("MONGO_URI"),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnv>) => {
        console.log("secret", configService.get("JWT_SECRET"));
        return {
          secret: configService.get("JWT_SECRET"),
          signOptions: {
            expiresIn: "15m",
          },
        };
      },
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
  ],
  controllers: [AppController, TicketsController, TicketsEventController],
  providers: [
    AppService,
    TicketsService,
    JwtStrategy,
    NatsJetStreamClient,
    TicketsEventService,
  ],
})
export class AppModule {}
