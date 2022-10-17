import { OrderCreatedEvent } from '@hdgticket/common';
import { NatsJetStreamClient } from '@nestjs-plugins/nestjs-nats-jetstream-transport';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from 'src/schemas/order.schema';

@Injectable()
export class OrderEventService {
  constructor(private natsClient: NatsJetStreamClient) {}

  //   async orderCreated(data: OrderCreatedEvent['data']) {}
}
