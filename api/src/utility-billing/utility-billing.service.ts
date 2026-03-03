import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UtilityBillingService {
  private readonly logger = new Logger(UtilityBillingService.name);

  constructor(private prisma: PrismaService) { }

  /**
   * Logic: Meter readings -> Invoices
   */
  async generateInvoiceFromReadings(
    roomId: string,
    month: number,
    year: number,
  ) {
    // 1. Get current and previous readings
    const readings = await this.prisma.utilityReading.findMany({
      where: { roomId },
      orderBy: { readingDate: 'desc' },
      take: 2,
    });

    if (readings.length < 1) {
      throw new Error('No meter readings found for room');
    }

    const currentReading = readings[0];
    // usage = currentValue - previousValue
    const usage = currentReading.currentValue - currentReading.previousValue;

    // 2. Get active contract to find rates and tenants
    const contract = await this.prisma.contract.findFirst({
      where: {
        roomId,
        status: { in: ['ACTIVE', 'CONTRACT_SIGNED'] },
      },
      include: { tenants: true },
    });

    if (!contract) {
      throw new Error('No active contract found for room');
    }

    // Standard rates (should ideally come from Building or Global config)
    const electricityRate = 4000; // 4k VND/kWh
    const waterRate = 30000; // 30k VND/m3

    let totalAmount = 0;

    if (currentReading.type === 'ELECTRICITY') {
      totalAmount = usage * electricityRate;
    } else if (currentReading.type === 'WATER') {
      totalAmount = usage * waterRate;
    }

    // 3. Create Invoice
    const invoice = await this.prisma.invoice.create({
      data: {
        contractId: contract.id,
        totalAmount: totalAmount,
        dueDate: new Date(year, month, 5), // Due on 5th of next month
        period: `${year}-${month.toString().padStart(2, '0')}`,
        status: 'DRAFT',
      },
    });

    // 4. Record in Ledger (Debit 131 AR, Credit 511 Revenue)
    await this.prisma.ledgerEntry.create({
      data: {
        description: `Utility Revenue - Room ${roomId} (${currentReading.type})`,
        amount: totalAmount,
        debitAccountId: '131',
        creditAccountId: '511',
        contractId: contract.id,
        buildingId: contract.buildingId,
        roomId: contract.roomId,
        invoiceId: invoice.id,
      },
    });

    this.logger.log(
      `Generated utility invoice ${invoice.id} for room ${roomId}`,
    );
    return invoice;
  }
}
