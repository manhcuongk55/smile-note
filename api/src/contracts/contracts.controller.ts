import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('buildingId') buildingId?: string,
  ) {
    return this.contractsService.findAll({ status, buildingId });
  }

  @Get('counts')
  async getStatusCounts() {
    return this.contractsService.getStatusCounts();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Post()
  async create(@Body() data: any) {
    return this.contractsService.create(data);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: string;
      depositDate?: string;
      moveInDate?: string;
      startDate?: string;
      endDate?: string;
      contractImages?: string;
      notes?: string;
    },
  ) {
    const { status, ...extra } = body;
    return this.contractsService.updateStatus(id, status, extra);
  }

  @Post(':id/notes')
  async addNote(@Param('id') id: string, @Body() body: { note: string }) {
    return this.contractsService.addNote(id, body.note);
  }

  @Post(':id/tenants')
  async addTenant(@Param('id') id: string, @Body() body: any) {
    return this.contractsService.addTenant(id, body);
  }
}
