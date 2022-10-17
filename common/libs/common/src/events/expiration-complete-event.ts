import { TSubjects } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: TSubjects["ExpirationComplete"];
  data: {
    orderId: string;
  };
}
