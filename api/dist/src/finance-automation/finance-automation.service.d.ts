import { PrismaService } from '../prisma/prisma.service';
export declare class FinanceAutomationService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    calculateAndRecordCommission(contractId: string): Promise<void>;
    calculateAndRecordKPIBonus(managerId: string, year: number, month: number): Promise<void>;
    handleDepositCancellation(contractId: string, approved: boolean): Promise<void>;
}
