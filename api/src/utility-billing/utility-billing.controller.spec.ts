import { Test, TestingModule } from '@nestjs/testing';
import { UtilityBillingController } from './utility-billing.controller';

describe('UtilityBillingController', () => {
  let controller: UtilityBillingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UtilityBillingController],
    }).compile();

    controller = module.get<UtilityBillingController>(UtilityBillingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
