import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { BuildingsModule } from './buildings/buildings.module';
import { RoomsModule } from './rooms/rooms.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ContractsModule } from './contracts/contracts.module';
import { FinanceAutomationModule } from './finance-automation/finance-automation.module';
import { AccountingModule } from './accounting/accounting.module';
import { RuleEngineModule } from './rule-engine/rule-engine.module';
import { ComplianceModule } from './compliance/compliance.module';
import { UtilityBillingModule } from './utility-billing/utility-billing.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    TasksModule,
    BuildingsModule,
    RoomsModule,
    DashboardModule,
    ContractsModule,
    FinanceAutomationModule,
    AccountingModule,
    RuleEngineModule,
    ComplianceModule,
    UtilityBillingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
