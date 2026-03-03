import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ComplianceService } from './compliance.service';

@Controller('compliance')
export class ComplianceController {
  constructor(private readonly complianceService: ComplianceService) {}

  @Get('pccc')
  getPCCC(@Query('buildingId') buildingId?: string) {
    return this.complianceService.getPCCCChecklist(buildingId);
  }

  @Post('sync-resident')
  syncResident(@Body() data: { contractId: string; residentData: any }) {
    return this.complianceService.syncResidentData(
      data.contractId,
      data.residentData,
    );
  }

  @Post('digital-sync')
  digitalSync(@Body() data: { contractId: string; ocrResult: any }) {
    return this.complianceService.processDigitalContract(
      data.contractId,
      data.ocrResult,
    );
  }
}
