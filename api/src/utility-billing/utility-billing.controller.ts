import { Controller, Post, Body } from '@nestjs/common';
import { UtilityBillingService } from './utility-billing.service';

@Controller('utility-billing')
export class UtilityBillingController {
  constructor(private readonly utilityBillingService: UtilityBillingService) {}

  @Post('generate')
  async generateInvoice(
    @Body() data: { roomId: string; month: number; year: number },
  ) {
    return this.utilityBillingService.generateInvoiceFromReadings(
      data.roomId,
      data.month,
      data.year,
    );
  }
}
