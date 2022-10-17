import {
  consumerOpts,
  JetStreamClient,
  JsMsg,
  JSONCodec,
  NatsConnection,
  connect,
  createInbox,
  StorageType,
} from "nats";
// import { setTimeout } from "timers/promises";
// console.clear();

async function jetstreamConfig(nc: NatsConnection) {
  const streams = "mystream";
  const subjects = "ticket.*";
  const jsm = await nc.jetstreamManager();
  // await jsm.consumers.delete("mystream", "$G");
  // await jsm.streams.delete(steams)
  await jsm.streams.add({
    name: streams,
    subjects: [subjects],
    storage: StorageType.Memory,
  });
}

interface IData {
  id: string;
  title: string;
  price: number;
}
abstract class Listener {
  abstract subject: string;
  abstract durableName: string;
  abstract queueGroupName: string;
  abstract onMessage(data: IData, msg: JsMsg): void;

  protected ackWait: number = 5 * 1000; //sec
  public client: JetStreamClient;
  private jc = JSONCodec<IData>();
  constructor(nc: NatsConnection) {
    this.client = nc.jetstream();
    console.log("Listener created");
  }

  get subscribeOptions() {
    const options = consumerOpts();
    options.durable(this.durableName);
    options.queue(this.queueGroupName);
    options.deliverTo(this.queueGroupName);
    options.manualAck();
    options.ackWait(this.ackWait);
    options.ackExplicit();
    options.replayInstantly();
    return options;
  }

  async listen() {
    console.log("listen");
    const subscription = await this.client.subscribe(
      this.subject,
      this.subscribeOptions
    );
    console.log("sub");
    for await (const msg of subscription) {
      console.log(`Message received: ${msg.subject} / ${this.queueGroupName}`);
      this.onMessage(this.parseMessage(msg), msg);
    }
  }

  parseMessage(msg: JsMsg) {
    return this.jc.decode(msg.data);
  }
}

class TicketCreatedListener extends Listener {
  subject = "ticket.created";
  queueGroupName: string = "payments-services";
  durableName = "ticket-created";
  onMessage(data: IData, msg: JsMsg): void {
    console.log("Ticket Created Event data!", data);
    console.log("seq", msg.seq);
    msg.ack();
  }
}

class TicketUpdateListener extends Listener {
  subject: string = "ticket.updated";
  durableName: string = "ticket-updated";
  queueGroupName: string = "payments-services";
  onMessage(data: IData, msg: JsMsg): void {
    console.log("Ticket Updated Event data!", data);
    console.log("seq", msg.seq);
    msg.ack();
  }
}

async function main() {
  const nc = await connect({
    servers: ["host.docker.internal:4222"],
    name: "listener",
  });
  await jetstreamConfig(nc);
  console.log("JetSteam configured");
  new TicketCreatedListener(nc).listen();
  new TicketUpdateListener(nc).listen();
}

main();
