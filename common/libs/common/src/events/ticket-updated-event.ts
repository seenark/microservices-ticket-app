import { TSubjects } from "./subjects";
export interface TicketUpdatedEvent {
  subject: TSubjects["TicketUpdated"];
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
