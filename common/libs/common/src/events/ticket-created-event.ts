import { TSubjects } from "./subjects";

export interface TicketCreatedEvent {
  subject: TSubjects["TicketCreated"];
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
