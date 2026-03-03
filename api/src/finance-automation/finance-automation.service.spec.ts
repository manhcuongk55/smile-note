import { Test, TestingModule } from '@nestjs/testing';
import { FinanceAutomationService } from './finance-automation.service';

describe('FinanceAutomationService', () => {
  let service: FinanceAutomationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinanceAutomationService],
    }).compile();

    service = module.get<FinanceAutomationService>(FinanceAutomationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
