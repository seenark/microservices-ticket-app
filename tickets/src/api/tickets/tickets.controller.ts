import { JwtAuthGuard, TUserData, UserData } from "@hdgticket/common";
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { z } from "zod";
import { TicketsService } from "./tickets.service";

const validateBody = z
  .object({
    title: z.string().min(1),
    price: z.number().min(0),
  })
  .strict();

type TBody = z.infer<typeof validateBody>;

@Controller("api/tickets")
export class TicketsController {
  private logger = new Logger(TicketsController.name);

  constructor(private ticketService: TicketsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTickets() {
    const all = await this.ticketService.findAll();
    return all;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  createTicket(@Body() body: TBody, @UserData() userData: TUserData) {
    try {
      const data = validateBody.parse(body);
      return this.ticketService.create(data.title, data.price, userData.id);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getTicketById(@Param("id") id: string) {
    const ticket = await this.ticketService.findById(id);
    if (!ticket) {
      throw new NotFoundException();
    }
    return {
      title: ticket.title,
      id: ticket.id,
      price: ticket.price,
      userId: ticket.userId,
    };
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  async updateTicket(
    @Param("id") id: string,
    @Body() body: TBody,
    @UserData() userData: TUserData,
  ) {
    try {
      const data = validateBody.parse(body);
      const saved = await this.ticketService.update(
        id,
        data.title,
        data.price,
        userData.id,
      );
      return saved;
    } catch (error) {
      throw error;
    }
  }

  @Get("/health")
  health() {
    return "OK";
  }
}
