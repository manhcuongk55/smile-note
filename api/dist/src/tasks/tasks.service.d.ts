import { PrismaService } from '../prisma/prisma.service';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        organizationId: string;
        managerId?: string;
        buildingId?: string;
    }): Promise<any>;
    findOne(id: string): Promise<any>;
    create(data: any): Promise<any>;
    update(id: string, data: any): Promise<any>;
    remove(id: string): Promise<any>;
    logAction(taskId: string, userId: string, action: string, payload?: any): Promise<any>;
}
