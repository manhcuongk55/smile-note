import { UtilityBillingService } from './utility-billing.service';
export declare class UtilityBillingController {
    private readonly utilityBillingService;
    constructor(utilityBillingService: UtilityBillingService);
    generateInvoice(data: {
        roomId: string;
        month: number;
        year: number;
    }): Promise<{
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
