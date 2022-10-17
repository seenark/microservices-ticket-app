import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import { CustomStrategy } from "@nestjs/microservices";
import { NatsJetStreamServer } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { ConfigService } from "@nestjs/config";
import { TEnv } from "./env.validate";
import { StorageType } from "nats";
import { AllSubjects } from "@hdgticket/common";
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService<TEnv>);
  const optoins: CustomStrategy = {
    strategy: new NatsJetStreamServer({
      connectionOptions: {
        servers: configService.get("NATS_URL"),
        name: configService.get("NATS_CLIENT_ID"),
      },
      consumerOptions: {
        deliverGroup: "ticket",
        durable: "ticket",
        deliverTo: "everyone",
        manualAck: true,
        ackWait: 5000,
        replayPolicy: "Instant",
      },
      streamConfig: {
        name: "mystream",
        subjects: AllSubjects,
        storage: StorageType.Memory,
      },
    }),
  };
  const microservice = app.connectMicroservice(optoins);

  app.use(cookieParser());
  const port = process.env.PORT || 3000;
  console.log("App starting on port: " + port);

  await microservice.listen();
  console.log("microservice connected");

  await app.listen(port);
}
bootstrap();
