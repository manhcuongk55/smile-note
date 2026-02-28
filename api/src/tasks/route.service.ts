import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RouteService {
    constructor(private prisma: PrismaService) { }

    async getOptimizedRoute(managerId: string) {
        const tasks = await this.prisma.task.findMany({
            where: {
                assignedManagerId: managerId,
                status: 'PENDING',
                deletedAt: null,
            },
            include: {
                building: true,
                room: true,
            },
            orderBy: [
                { building: { name: 'asc' } }, // Group by building
                { room: { floor: 'asc' } },    // bottom-to-top floor traversal
                { priority: 'desc' },         // within building, prioritize
            ],
        });

        // In a real production app, we would use a TSP (Traveling Salesperson) 
        // algorithm here using the building latitude/longitude.
        // For now, we use building-grouping and floor-sorting.

        return tasks;
    }
}
