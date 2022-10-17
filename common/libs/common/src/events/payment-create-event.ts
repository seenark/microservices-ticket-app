import { TSubjects } from "./subjects";

export interface PaymentCreatedEvent {
  subject: TSubjects["PaymentCreated"];
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
