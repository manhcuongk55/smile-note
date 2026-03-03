import { RuleEngineService } from './rule-engine.service';
export declare class RuleEngineController {
    private readonly ruleEngineService;
    constructor(ruleEngineService: RuleEngineService);
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
