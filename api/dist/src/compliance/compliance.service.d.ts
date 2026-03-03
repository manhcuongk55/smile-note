import { PrismaService } from '../prisma/prisma.service';
export declare class ComplianceService {
    private prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getPCCCChecklist(buildingId?: string): Promise<{
        buildingId: string;
        buildingName: string;
        address: string;
        lastInspection: Date;
        nextInspection: Date;
        isOverdue: boolean;
        status: string;
    }[]>;
    syncResidentData(contractId: string, residentData: {
        name: string;
        idCard: string;
        phone?: string;
        email?: string;
    }): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        notes: string | null;
        phone: string | null;
        idCard: string | null;
        isRepresentative: boolean;
        contractId: string;
    }>;
    processDigitalContract(contractId: string, ocrResult: any): Promise<{
        success: boolean;
        matchedCount: number;
    }>;
}
