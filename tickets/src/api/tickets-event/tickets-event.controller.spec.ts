import { Test, TestingModule } from '@nestjs/testing';
import { TicketsEventController } from './tickets-event.controller';

describe('TicketsEventController', () => {
  let controller: TicketsEventController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TicketsEventController],
    }).compile();

    controller = module.get<TicketsEventController>(TicketsEventController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
