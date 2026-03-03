import { Module } from '@nestjs/common';
import { FinanceAutomationService } from './finance-automation.service';

@Module({
  providers: [FinanceAutomationService],
})
export class FinanceAutomationModule {}
