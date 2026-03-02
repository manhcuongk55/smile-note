import { PrismaService } from '../prisma/prisma.service';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(buildingId: string): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        floor: number;
        status: string;
        buildingId: string;
    }[]>;
    create(data: any): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        floor: number;
        status: string;
        buildingId: string;
    }>;
    updateStatus(id: string, status: string): Promise<{
        number: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        floor: number;
        status: string;
        buildingId: string;
    }>;
}
