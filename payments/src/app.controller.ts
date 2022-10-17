import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('_status/healthz')
  statusHealthz() {
    return 'OK';
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
