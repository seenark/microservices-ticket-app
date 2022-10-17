const ticket = `ticket`;
const order = `order`;
const expiration = `expiration`;
const payment = `payment`;

export const Subjects = {
  TicketAll: `${ticket}.*`,
  TicketCreated: `${ticket}.created`,
  TicketUpdated: `${ticket}.updated`,
  OrderAll: `${order}.*`,
  OrderCreated: `${order}.created`,
  OrderCancelled: `${order}.cancelled`,
  ExpirationAll: `${expiration}.*`,
  ExpirationComplete: `${expiration}.complete`,
  PaymentAll: `${payment}.*`,
  PaymentCreated: `${payment}.created`,
} as const;

export const AllSubjects = [
  Subjects.TicketAll,
  Subjects.OrderAll,
  Subjects.ExpirationAll,
  Subjects.PaymentAll,
];

export type TSubjects = typeof Subjects;
