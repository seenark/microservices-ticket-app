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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: "./.env",
      validate: validateEnv,
    }),
    // MongooseModule.forRootAsync({
    //   useFactory: (configService: ConfigService<TEnv>) => {
    //     return {
    //       uri: configService.get("MONGO_URI"),
    //     };
    //   },
    //   inject: [ConfigService],
    // }),
    // MongooseModule.forFeature(),
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
  ],
  controllers: [AppController, TicketsController],
  providers: [AppService, TicketsService, JwtStrategy],
})
export class AppModule {}
