import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DashboardService {
    constructor(private prisma: PrismaService) { }

    async getStats() {
        const pendingTasks = await this.prisma.task.count({
            where: { status: 'PENDING', deletedAt: null },
        });

        const occupiedRooms = await this.prisma.room.count({
            where: { status: 'OCCUPIED' },
        });

        const totalBuildings = await this.prisma.building.count();

        return {
            pendingTasks,
            occupiedRooms,
            totalBuildings,
        };
    }
}
