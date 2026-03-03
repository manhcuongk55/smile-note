import { Test, TestingModule } from '@nestjs/testing';
import { UtilityBillingService } from './utility-billing.service';

describe('UtilityBillingService', () => {
  let service: UtilityBillingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UtilityBillingService],
    }).compile();

    service = module.get<UtilityBillingService>(UtilityBillingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
