import { ComplianceService } from './compliance.service';
export declare class ComplianceController {
    private readonly complianceService;
    constructor(complianceService: ComplianceService);
    getPCCC(buildingId?: string): Promise<{
        buildingId: string;
        buildingName: string;
        address: string;
        lastInspection: Date;
        nextInspection: Date;
        isOverdue: boolean;
        status: string;
    }[]>;
    syncResident(data: {
        contractId: string;
        residentData: any;
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
    digitalSync(data: {
        contractId: string;
        ocrResult: any;
    }): Promise<{
        success: boolean;
        matchedCount: number;
    }>;
}
