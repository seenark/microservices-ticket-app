import { connect, JetStreamClient, JSONCodec } from "nats";
// console.clear();

const data = {
  id: "123",
  title: "concert",
  price: 20,
};
async function main() {
  const nc = await connect({
    servers: ["host.docker.internal:4222"],
    name: "publisher",
  });

  const js = nc.jetstream();
  // const jc = JSONCodec<typeof data>();
  // const pubAck = await js.publish("ticket.created", jc.encode(data));
  // console.log("event published", data, "seq:", pubAck.seq);

  const publisher = new TicketCreatePublisher(js) 
  await publisher.publish(data)

  await nc.close();
  console.log(await nc.isClosed());
}

main();

interface Event {
  subject: string
  data: any
}

abstract class Publiser<T extends Event> {
  abstract subject: T['subject']
  jsonCodec = JSONCodec<T['data']>()
  constructor(public client: JetStreamClient) {}

  async publish(data: T['data']) {
    const pubAck = await this.client.publish(this.subject, this.jsonCodec.encode(data))
    console.log("Event published", data, "seq: ", pubAck.seq)
  }
}

interface TicketCreatedEvent {
  subject: "ticket.created";
  data: {
    id: string;
    title: string;
    price: number;
  };
}
class TicketCreatePublisher extends Publiser<TicketCreatedEvent> {
    subject: "ticket.created" = "ticket.created"
}




