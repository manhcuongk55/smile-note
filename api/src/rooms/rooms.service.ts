import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoomsService {
    constructor(private prisma: PrismaService) { }

    async findAll(buildingId: string) {
        return this.prisma.room.findMany({
            where: { buildingId },
        });
    }

    async create(data: any) {
        return this.prisma.room.create({ data });
    }

    async updateStatus(id: string, status: string) {
        return this.prisma.room.update({
            where: { id },
            data: { status },
        });
    }
}
