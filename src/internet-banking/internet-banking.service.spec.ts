import { Test, TestingModule } from '@nestjs/testing';
import { InternetBankingService } from './internet-banking.service';

describe('InternetBankingService', () => {
  let service: InternetBankingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InternetBankingService],
    }).compile();

    service = module.get<InternetBankingService>(InternetBankingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
