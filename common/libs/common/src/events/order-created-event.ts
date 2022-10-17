import { TSubjects } from "./subjects";
import { OrderStatus } from "./types";

export interface OrderCreatedEvent {
  subject: TSubjects["OrderCreated"];
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}
