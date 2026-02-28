import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BuildingsService {
    constructor(private prisma: PrismaService) { }

    async findAll(organizationId: string) {
        return this.prisma.building.findMany({
            where: { organizationId },
            include: { rooms: true },
        });
    }

    async findOne(id: string) {
        return this.prisma.building.findUnique({
            where: { id },
            include: { rooms: true },
        });
    }

    async create(data: any) {
        return this.prisma.building.create({ data });
    }
}
