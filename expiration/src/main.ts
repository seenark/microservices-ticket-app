import { AllSubjects } from "@hdgticket/common";
import { NatsJetStreamServer } from "@nestjs-plugins/nestjs-nats-jetstream-transport";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { CustomStrategy } from "@nestjs/microservices";
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
        deliverGroup: "expiration",
        durable: "expiration",
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
  await microservice.listen();
  console.log("microservice connected");

  const port = process.env.PORT || 3000;
  console.log("App starting on port: " + port);
  await app.listen(port);
}
bootstrap();
