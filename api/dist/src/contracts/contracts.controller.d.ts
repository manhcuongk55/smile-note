import { ContractsService } from './contracts.service';
export declare class ContractsController {
    private readonly contractsService;
    constructor(contractsService: ContractsService);
    findAll(status?: string, buildingId?: string): Promise<({
        building: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
        };
        room: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        };
        manager: {
            id: string;
            name: string;
        };
        tenants: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: string;
        buildingId: string;
        notes: string | null;
        roomId: string;
        monthlyRent: number | null;
        depositAmount: number | null;
        depositDate: Date | null;
        moveInDate: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        contractImages: string | null;
        managerId: string;
    })[]>;
    getStatusCounts(): Promise<Record<string, number>>;
    findOne(id: string): Promise<({
        building: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
        };
        room: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        };
        manager: {
            id: string;
            name: string;
            email: string;
        };
        tenants: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: string;
        buildingId: string;
        notes: string | null;
        roomId: string;
        monthlyRent: number | null;
        depositAmount: number | null;
        depositDate: Date | null;
        moveInDate: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        contractImages: string | null;
        managerId: string;
    }) | null>;
    create(data: any): Promise<{
        building: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
        };
        room: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        };
        tenants: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: string;
        buildingId: string;
        notes: string | null;
        roomId: string;
        monthlyRent: number | null;
        depositAmount: number | null;
        depositDate: Date | null;
        moveInDate: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        contractImages: string | null;
        managerId: string;
    }>;
    updateStatus(id: string, body: {
        status: string;
        depositDate?: string;
        moveInDate?: string;
        startDate?: string;
        endDate?: string;
        contractImages?: string;
        notes?: string;
    }): Promise<{
        building: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            organizationId: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
        };
        room: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        };
        tenants: {
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
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: string;
        buildingId: string;
        notes: string | null;
        roomId: string;
        monthlyRent: number | null;
        depositAmount: number | null;
        depositDate: Date | null;
        moveInDate: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        contractImages: string | null;
        managerId: string;
    }>;
    addNote(id: string, body: {
        note: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        status: string;
        buildingId: string;
        notes: string | null;
        roomId: string;
        monthlyRent: number | null;
        depositAmount: number | null;
        depositDate: Date | null;
        moveInDate: Date | null;
        startDate: Date | null;
        endDate: Date | null;
        contractImages: string | null;
        managerId: string;
    }>;
    addTenant(id: string, body: any): Promise<{
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
}
