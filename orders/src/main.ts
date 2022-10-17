import { AllSubjects } from "@hdgticket/common";
import { NatsJetStreamServer } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { CustomStrategy } from "@nestjs/microservices";
import * as cookieParser from "cookie-parser";
import { StorageType } from "nats";
import { AppModule } from "./app.module";
import { TEnv } from "./env.validate";

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
        deliverGroup: "orders",
        durable: "orders",
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

  await microservice.listen();
  console.log("microservice connected");

  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
  console.log("App starting on port: " + port);
}
bootstrap();
