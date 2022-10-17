import { Test, TestingModule } from '@nestjs/testing';
import { TicketsEventService } from './tickets-event.service';

describe('TicketsEventService', () => {
  let service: TicketsEventService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TicketsEventService],
    }).compile();

    service = module.get<TicketsEventService>(TicketsEventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
