export enum OrderStatus {
  // When the order has been created, but the ticket it is trying to order has not been reserved.
  Create = "created",
  // The ticket the order is trying to reserve has already been reserved, or when user has cancelled the order
  Cancelled = "cancelled",
  // The order has successfully reserved the ticket
  AwaitingPayment = "awaiting:payment",
  // the order has reserved the ticket and the user has provided payment successfully
  Complete = "complete",
}
