import { PrismaService } from '../prisma/prisma.service';
export declare class UtilityBillingService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    generateInvoiceFromReadings(roomId: string, month: number, year: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: string;
        contractId: string;
        period: string;
        dueDate: Date;
        items: string | null;
        totalAmount: number;
    }>;
}
