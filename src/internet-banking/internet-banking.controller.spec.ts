import { Test, TestingModule } from '@nestjs/testing';
import { InternetBankingController } from './internet-banking.controller';
import { InternetBankingService } from './internet-banking.service';

describe('InternetBankingController', () => {
  let controller: InternetBankingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InternetBankingController],
      providers: [InternetBankingService],
    }).compile();

    controller = module.get<InternetBankingController>(InternetBankingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
