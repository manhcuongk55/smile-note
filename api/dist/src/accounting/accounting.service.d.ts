import { PrismaService } from '../prisma/prisma.service';
export declare class AccountingService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<{
        totalCash: number;
        monthlyRevenue: number;
        accountsReceivable: number;
        totalDeposits: number;
        lastTransactions: ({
            debitAccount: {
                name: string;
            };
            creditAccount: {
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            buildingId: string | null;
            description: string;
            roomId: string | null;
            date: Date;
            amount: number;
            debitAccountId: string;
            creditAccountId: string;
            contractId: string | null;
            invoiceId: string | null;
        })[];
    }>;
}
