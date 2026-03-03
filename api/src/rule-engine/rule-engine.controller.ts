import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';

@Controller('rule-engine')
export class RuleEngineController {
  constructor(private readonly ruleEngineService: RuleEngineService) {}

  @Post('record')
  recordViolation(
    @Body()
    data: {
      roomId: string;
      type: 'ELECTRICITY' | 'LAUNDRY';
      description?: string;
    },
  ) {
    return this.ruleEngineService.recordViolation(data);
  }

  @Get('violations')
  getViolations(@Query('roomId') roomId?: string) {
    return this.ruleEngineService.getViolations(roomId);
  }
}
