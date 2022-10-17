import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import { Job } from "bull";
import { ExpirationQueueService } from "./expiration-queue.service";
import { IExpirationQueuePayload } from "./payload";

@Processor("expiration-queue")
export class ExpirationQueueProcess {
  private logger = new Logger(ExpirationQueueProcess.name);

  constructor(private expirationQueueService: ExpirationQueueService) {}

  @Process()
  async handleExpirationQueue(job: Job<IExpirationQueuePayload>) {
    this.logger.log(`processing queue`);
    this.logger.debug(JSON.stringify(job));
    const pubAck =
      await this.expirationQueueService.emitExpirationCompleteEvent(
        job.data.orderId,
      );
    console.log("pubAck", pubAck);
  }
}
