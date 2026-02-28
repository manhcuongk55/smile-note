import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';


@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async findAll(params: {
        organizationId: string;
        managerId?: string;
        buildingId?: string;
    }) {
        return this.prisma.task.findMany({
            where: {
                organizationId: params.organizationId,
                assignedManagerId: params.managerId,
                buildingId: params.buildingId,
                deletedAt: null,
            },
            include: {
                building: true,
                room: true,
            },
            orderBy: [
                { priority: 'desc' },
                { building: { name: 'asc' } },
                { room: { floor: 'asc' } },
                { room: { number: 'asc' } },
            ],
        });
    }

    async findOne(id: string) {
        return this.prisma.task.findUnique({
            where: { id },
            include: { building: true, room: true, logs: true },
        });
    }

    async create(data: any) {
        return this.prisma.task.create({ data });
    }

    async update(id: string, data: any) {
        return this.prisma.task.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        return this.prisma.task.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    async logAction(taskId: string, userId: string, action: string, payload?: any) {
        return this.prisma.activityLog.create({
            data: {
                taskId,
                userId,
                action,
                payload: payload ? JSON.stringify(payload) : null,
            },
        });
    }
}
