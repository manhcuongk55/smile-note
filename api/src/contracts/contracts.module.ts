import { Module } from '@nestjs/common';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { PrismaModule } from '../prisma/prisma.module';
import { FinanceAutomationModule } from '../finance-automation/finance-automation.module';

@Module({
  imports: [PrismaModule, FinanceAutomationModule],
  controllers: [ContractsController],
  providers: [ContractsService],
  exports: [ContractsService],
})
export class ContractsModule {}
