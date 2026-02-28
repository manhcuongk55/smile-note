import { PrismaService } from '../prisma/prisma.service';
export declare class RouteService {
    private prisma;
    constructor(prisma: PrismaService);
    getOptimizedRoute(managerId: string): Promise<any>;
}
