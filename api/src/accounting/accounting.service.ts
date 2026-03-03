import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AccountingService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    // Calculate Cash (Accounts 111 + 112)
    const cashDebit = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { debitAccountId: { in: ['111', '112'] } },
    });
    const cashCredit = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { creditAccountId: { in: ['111', '112'] } },
    });
    const totalCash =
      (cashDebit._sum.amount || 0) - (cashCredit._sum.amount || 0);

    // Calculate Revenue (Account 511)
    const revenue = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { creditAccountId: '511' },
    });

    // Calculate AR (Account 131)
    const arDebit = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { debitAccountId: '131' },
    });
    const arCredit = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { creditAccountId: '131' },
    });
    const accountsReceivable =
      (arDebit._sum.amount || 0) - (arCredit._sum.amount || 0);

    // Calculate Active Deposits (Account 3386)
    const depositCredit = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { creditAccountId: '3386' },
    });
    const depositDebit = await this.prisma.ledgerEntry.aggregate({
      _sum: { amount: true },
      where: { debitAccountId: '3386' },
    });
    const totalDeposits =
      (depositCredit._sum.amount || 0) - (depositDebit._sum.amount || 0);

    return {
      totalCash,
      monthlyRevenue: revenue._sum.amount || 0,
      accountsReceivable,
      totalDeposits,
      lastTransactions: await this.prisma.ledgerEntry.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: {
          debitAccount: { select: { name: true } },
          creditAccount: { select: { name: true } },
        },
      }),
    };
  }
}
