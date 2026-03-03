import { PrismaService } from '../prisma/prisma.service';
export declare class RuleEngineService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    recordViolation(data: {
        roomId: string;
        type: 'ELECTRICITY' | 'LAUNDRY';
        description?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string | null;
        roomId: string;
        date: Date;
        amount: number;
        contractId: string | null;
        invoiceId: string | null;
        count: number;
    }>;
    getViolations(roomId?: string): Promise<({
        room: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        type: string;
        description: string | null;
        roomId: string;
        date: Date;
        amount: number;
        contractId: string | null;
        invoiceId: string | null;
        count: number;
    })[]>;
}
