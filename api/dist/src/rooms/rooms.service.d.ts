import { PrismaService } from '../prisma/prisma.service';
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(buildingId: string): Promise<any>;
    create(data: any): Promise<any>;
    updateStatus(id: string, status: string): Promise<any>;
}
