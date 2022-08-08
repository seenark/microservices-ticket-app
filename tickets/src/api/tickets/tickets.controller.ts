import { JwtAuthGuard } from "@hdgticket/common";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("api/tickets")
export class TicketsController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getAllTickets(): string {
    return "OK";
  }
}
