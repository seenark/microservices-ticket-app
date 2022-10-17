import { TSubjects } from "./subjects";

export interface OrderCancelledEvent {
  subject: TSubjects["OrderCancelled"];
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
