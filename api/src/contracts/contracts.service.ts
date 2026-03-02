import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContractsService {
    constructor(private prisma: PrismaService) { }

    async findAll(params?: { status?: string; buildingId?: string }) {
        return this.prisma.contract.findMany({
            where: {
                status: params?.status,
                buildingId: params?.buildingId,
            },
            include: {
                building: true,
                room: true,
                manager: { select: { id: true, name: true } },
                tenants: true,
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async findOne(id: string) {
        return this.prisma.contract.findUnique({
            where: { id },
            include: {
                building: true,
                room: true,
                manager: { select: { id: true, name: true, email: true } },
                tenants: true,
            },
        });
    }

    async create(data: {
        organizationId: string;
        buildingId: string;
        roomId: string;
        managerId: string;
        monthlyRent?: number;
        depositAmount?: number;
        notes?: string;
        tenants?: { name: string; phone?: string; idCard?: string; isRepresentative?: boolean; notes?: string }[];
    }) {
        const contract = await this.prisma.contract.create({
            data: {
                status: 'CONSULTING',
                organizationId: data.organizationId,
                buildingId: data.buildingId,
                roomId: data.roomId,
                managerId: data.managerId,
                monthlyRent: data.monthlyRent,
                depositAmount: data.depositAmount,
                notes: data.notes,
                tenants: data.tenants ? {
                    create: data.tenants,
                } : undefined,
            },
            include: {
                building: true,
                room: true,
                tenants: true,
            },
        });

        return contract;
    }

    async updateStatus(id: string, status: string, extra?: {
        depositDate?: string;
        moveInDate?: string;
        startDate?: string;
        endDate?: string;
        contractImages?: string;
        notes?: string;
    }) {
        return this.prisma.contract.update({
            where: { id },
            data: {
                status,
                depositDate: extra?.depositDate ? new Date(extra.depositDate) : undefined,
                moveInDate: extra?.moveInDate ? new Date(extra.moveInDate) : undefined,
                startDate: extra?.startDate ? new Date(extra.startDate) : undefined,
                endDate: extra?.endDate ? new Date(extra.endDate) : undefined,
                contractImages: extra?.contractImages,
                notes: extra?.notes,
            },
            include: {
                building: true,
                room: true,
                tenants: true,
            },
        });
    }

    async addNote(id: string, note: string) {
        const contract = await this.prisma.contract.findUnique({ where: { id } });
        const existingNotes = contract?.notes || '';
        const timestamp = new Date().toLocaleString('vi-VN');
        const updatedNotes = `${existingNotes}\n[${timestamp}] ${note}`.trim();

        return this.prisma.contract.update({
            where: { id },
            data: { notes: updatedNotes },
        });
    }

    async addTenant(contractId: string, tenant: {
        name: string;
        phone?: string;
        idCard?: string;
        isRepresentative?: boolean;
        notes?: string;
    }) {
        return this.prisma.tenant.create({
            data: {
                ...tenant,
                contractId,
            },
        });
    }

    async getStatusCounts() {
        const statuses = ['CONSULTING', 'DEPOSIT_REQUESTED', 'DEPOSITED', 'CONTRACT_SIGNED', 'ACTIVE', 'ENDED'];
        const counts: Record<string, number> = {};
        for (const status of statuses) {
            counts[status] = await this.prisma.contract.count({ where: { status } });
        }
        counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
        return counts;
    }
}
