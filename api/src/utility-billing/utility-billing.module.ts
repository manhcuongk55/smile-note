import { Module } from '@nestjs/common';
import { UtilityBillingService } from './utility-billing.service';
import { UtilityBillingController } from './utility-billing.controller';

@Module({
  providers: [UtilityBillingService],
  controllers: [UtilityBillingController],
})
export class UtilityBillingModule {}
