import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FinanceAutomationService {
  private readonly logger = new Logger(FinanceAutomationService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Trigger: On_Contract_Signed
   * Calculates commission based on duration (3M, 6M, 12M)
   */
  async calculateAndRecordCommission(contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: { manager: true },
    });

    if (!contract || !contract.monthlyRent || !contract.contractType) {
      this.logger.warn(
        `Contract ${contractId} missing data for commission calculation`,
      );
      return;
    }

    let percentage = 0;
    switch (contract.contractType) {
      case '3M':
        percentage = 0.15;
        break;
      case '6M':
        percentage = 0.2;
        break;
      case '12M':
        percentage = 0.25;
        break;
      default:
        this.logger.warn(
          `Unknown contract type ${contract.contractType} for contract ${contractId}`,
        );
        return;
    }

    const amount = contract.monthlyRent * percentage;

    // Create Ledger Entry: Debit 642 (General & Admin), Credit 331 (Payables)
    await this.prisma.ledgerEntry.create({
      data: {
        description: `Commission for contract ${contractId} (${contract.contractType})`,
        amount,
        debitAccountId: '642', // General and administrative expenses
        creditAccountId: '331', // Payables to sellers (or agents/CTV)
        contractId: contract.id,
        buildingId: contract.buildingId,
        roomId: contract.roomId,
      },
    });

    this.logger.log(
      `Recorded commission of ${amount} for contract ${contractId}`,
    );
  }

  /**
   * Logic Thưởng KPI: Count(Contracts) per month per CTV
   */
  async calculateAndRecordKPIBonus(
    managerId: string,
    year: number,
    month: number,
  ) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const contractCount = await this.prisma.contract.count({
      where: {
        managerId,
        status: 'CONTRACT_SIGNED',
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    if (contractCount < 3) return;

    let bonusPercentage = 0;
    if (contractCount >= 10) {
      bonusPercentage = 0.07;
    } else if (contractCount >= 3) {
      bonusPercentage = 0.05;
    }

    // Apply bonus logic (simplified for now: sum of rent * bonusPercentage)
    const contracts = await this.prisma.contract.findMany({
      where: {
        managerId,
        status: 'CONTRACT_SIGNED',
        updatedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRent = contracts.reduce(
      (sum, c) => sum + (c.monthlyRent || 0),
      0,
    );
    const bonusAmount = totalRent * bonusPercentage;

    if (bonusAmount > 0) {
      await this.prisma.ledgerEntry.create({
        data: {
          description: `KPI Bonus for ${managerId} - ${year}/${month} (${contractCount} contracts)`,
          amount: bonusAmount,
          debitAccountId: '642',
          creditAccountId: '331',
        },
      });
      this.logger.log(
        `Recorded KPI Bonus of ${bonusAmount} for manager ${managerId}`,
      );
    }
  }

  /**
   * Trigger: On_Deposit_Cancellation
   */
  async handleDepositCancellation(contractId: string, approved: boolean) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract || !contract.depositAmount) return;

    const amount = contract.depositAmount;

    if (approved) {
      // Split 50/50 between House & Sale
      const splitAmount = amount / 2;

      // Ledger: House takes 50%
      await this.prisma.ledgerEntry.create({
        data: {
          description: `Deposit split (50%) - House revenue for cancelled contract ${contractId}`,
          amount: splitAmount,
          debitAccountId: '3386', // Tenant deposits
          creditAccountId: '711', // Other Income
          contractId: contract.id,
        },
      });

      // Ledger: Sale takes 50% (as payable)
      await this.prisma.ledgerEntry.create({
        data: {
          description: `Deposit split (50%) - Sale commission for cancelled contract ${contractId}`,
          amount: splitAmount,
          debitAccountId: '3386',
          creditAccountId: '331',
          contractId: contract.id,
        },
      });
    } else {
      // House takes 100%
      await this.prisma.ledgerEntry.create({
        data: {
          description: `Deposit forfeiture (100%) - House revenue for cancelled contract ${contractId}`,
          amount,
          debitAccountId: '3386',
          creditAccountId: '711',
          contractId: contract.id,
        },
      });
    }
  }
}
