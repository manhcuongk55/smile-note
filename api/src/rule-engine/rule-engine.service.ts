import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RuleEngineService {
  private readonly logger = new Logger(RuleEngineService.name);

  constructor(private prisma: PrismaService) {}

  async recordViolation(data: {
    roomId: string;
    type: 'ELECTRICITY' | 'LAUNDRY';
    description?: string;
  }) {
    // Find existing violations of this type for the room
    const previousCount = await this.prisma.violation.count({
      where: {
        roomId: data.roomId,
        type: data.type,
      },
    });

    const currentCount = previousCount + 1;
    let amount = 0;

    if (data.type === 'ELECTRICITY') {
      // Lần 1 (Warning), Lần 2 (50k), Lần 3 (100k), Lần 4 (200k)
      if (currentCount === 2) amount = 50000;
      else if (currentCount === 3) amount = 100000;
      else if (currentCount >= 4) amount = 200000;
    } else if (data.type === 'LAUNDRY') {
      // Lần 1 (Warning), Lần 2 (100k), Lần 4 (500k)
      if (currentCount === 2) amount = 100000;
      else if (currentCount >= 4) amount = 500000;
    }

    const activeContract = await this.prisma.contract.findFirst({
      where: {
        roomId: data.roomId,
        status: { in: ['ACTIVE', 'CONTRACT_SIGNED'] },
      },
    });

    const violation = await this.prisma.violation.create({
      data: {
        roomId: data.roomId,
        contractId: activeContract?.id,
        type: data.type,
        count: currentCount,
        amount: amount,
        description:
          data.description || `${data.type} Violation #${currentCount}`,
      },
    });

    if (amount > 0) {
      // Create Ledger Entry: Debit 131 (AR), Credit 711 (Other Income)
      await this.prisma.ledgerEntry.create({
        data: {
          description: `Fine for ${data.type} Violation #${currentCount} (Room ${data.roomId})`,
          amount: amount,
          debitAccountId: '131',
          creditAccountId: '711',
          roomId: data.roomId,
          contractId: activeContract?.id,
        },
      });
      this.logger.log(
        `Recorded fine of ${amount} for ${data.type} violation #${currentCount} in room ${data.roomId}`,
      );
    }

    return violation;
  }

  async getViolations(roomId?: string) {
    return this.prisma.violation.findMany({
      where: roomId ? { roomId } : {},
      orderBy: { createdAt: 'desc' },
      include: { room: true },
    });
  }
}
