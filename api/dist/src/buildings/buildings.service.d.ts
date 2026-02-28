import { PrismaService } from '../prisma/prisma.service';
export declare class BuildingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(organizationId: string): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
}
