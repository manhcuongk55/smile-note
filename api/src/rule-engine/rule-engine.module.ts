import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { RuleEngineController } from './rule-engine.controller';

@Module({
  providers: [RuleEngineService],
  controllers: [RuleEngineController],
})
export class RuleEngineModule {}
