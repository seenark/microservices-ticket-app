import {
  JwtAuthGuard,
  OrderStatus,
  TUserData,
  UserData,
} from "@hdgticket/common";
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { OrdersEventService } from "../orders-event/orders-event.service";
import { TicketsService } from "../tickets/tickets.service";
import { OrdersService } from "./orders.service";

@Controller("api/orders")
export class OrdersController {
  private logger = new Logger(OrdersController.name);
  constructor(
    private orderService: OrdersService,
    private ticketService: TicketsService,
    private orderEventService: OrdersEventService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll(@UserData() userData: TUserData) {
    const orders = await this.orderService.getAll(userData.id);
    return orders;
  }

  @Get(":orderId")
  @UseGuards(JwtAuthGuard)
  async getOrderById(
    @UserData() userData: TUserData,
    @Param("orderId") orderId: string,
  ) {
    const order = await this.orderService.getById(orderId);
    if (!order) {
      throw new NotFoundException({ message: "not found order" });
    }
    if (order.userId !== userData.id) {
      throw new UnauthorizedException({ message: "unauthorized" });
    }
    return order;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() body: { ticketId: string },
    @UserData() userData: TUserData,
  ) {
    // Find the ticket the user is trying to order in DB
    const ticket = await this.ticketService.getTicketById(body.ticketId);
    if (!ticket) {
      throw new NotFoundException("not found ticketId");
    }
    // Make sure that ticket is not already reserved
    // Run query to look at all orders. Find an order where the ticket is the ticket we just found *and* the orders status is *not* cancelled.
    // If we find an order from that means the ticket *is* reserved
    const isReserved = await this.orderService.isReserved(ticket._id);
    if (isReserved) {
      throw new BadRequestException("Ticket already reserved");
    }
    // Calculate an expiration date for this order 15 minutes
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 15 * 60);
    // expiration.setSeconds(expiration.getSeconds() + 1 * 15);

    // Build the order and save it to the database
    const order = await this.orderService.create(
      userData.id,
      OrderStatus.Create,
      expiration,
      ticket,
    );

    // publish an event saying that an order was created
    this.orderEventService.emitOrderCreatedEvent({
      id: order.id,
      status: order.status,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      version: order.version,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    return order;
  }

  @Put(":orderId")
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Param() params: any,
    @Body() body: { status: OrderStatus; expiresAt: string },
  ) {
    const orderId = params.orderId;
    this.logger.debug(orderId);
    if (!orderId)
      throw new BadRequestException({ message: "order id invalid" });
    const order = await this.orderService.getById(orderId);
    if (!order) {
      throw new NotFoundException({
        message: "not found order id: " + orderId,
      });
    }
    const expireDate = new Date(body.expiresAt);
    return this.orderService.update(orderId, body.status, expireDate);
  }

  @Delete(":orderId")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteOrder(
    @UserData() userData: TUserData,
    @Param("orderId") orderId: string,
  ) {
    // we did not delete order but we change status to cancelled instead
    const order = await this.orderService.getById(orderId);
    if (!order) {
      throw new NotFoundException();
    }
    if (order.userId !== userData.id) {
      throw new UnauthorizedException();
    }

    // publish cancelled event
    await this.orderEventService.emitOrderCancelledEvent({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket._id,
      },
    });
    return this.orderService.updateStatus(orderId, OrderStatus.Cancelled);
  }

  @Get("test/ticket")
  async getAllTicket() {
    return this.ticketService.getAll();
  }

  @Post("test/ticket")
  @HttpCode(HttpStatus.CREATED)
  async createTicket(@Body() body: { title: string; price: number }) {
    const newId = new Types.ObjectId();
    this.logger.debug(`newId: ${newId.toHexString()}`);
    return await this.ticketService.create(newId, body.title, body.price);
  }

  @Get("test/ticket/:id")
  async getTicket(@Param("id") id: string) {
    return this.ticketService.getTicketById(id);
  }

  @Delete("test/ticket/:id")
  async deleteTicket(@Param("id") id: string) {
    return this.ticketService.delete(id);
  }
}
