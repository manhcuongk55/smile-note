"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const finance_automation_service_1 = require("../finance-automation/finance-automation.service");
let ContractsService = class ContractsService {
    prisma;
    financeAutomation;
    constructor(prisma, financeAutomation) {
        this.prisma = prisma;
        this.financeAutomation = financeAutomation;
    }
    async findAll(params) {
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
    async findOne(id) {
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
    async create(data) {
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
                tenants: data.tenants
                    ? {
                        create: data.tenants,
                    }
                    : undefined,
            },
            include: {
                building: true,
                room: true,
                tenants: true,
            },
        });
        return contract;
    }
    async updateStatus(id, status, extra) {
        const updatedContract = await this.prisma.contract.update({
            where: { id },
            data: {
                status,
                depositDate: extra?.depositDate
                    ? new Date(extra.depositDate)
                    : undefined,
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
        if (status === 'CONTRACT_SIGNED') {
            await this.financeAutomation.calculateAndRecordCommission(id);
        }
        return updatedContract;
    }
    async addNote(id, note) {
        const contract = await this.prisma.contract.findUnique({ where: { id } });
        const existingNotes = contract?.notes || '';
        const timestamp = new Date().toLocaleString('vi-VN');
        const updatedNotes = `${existingNotes}\n[${timestamp}] ${note}`.trim();
        return this.prisma.contract.update({
            where: { id },
            data: { notes: updatedNotes },
        });
    }
    async addTenant(contractId, tenant) {
        return this.prisma.tenant.create({
            data: {
                ...tenant,
                contractId,
            },
        });
    }
    async getStatusCounts() {
        const statuses = [
            'CONSULTING',
            'DEPOSIT_REQUESTED',
            'DEPOSITED',
            'CONTRACT_SIGNED',
            'ACTIVE',
            'ENDED',
        ];
        const counts = {};
        for (const status of statuses) {
            counts[status] = await this.prisma.contract.count({ where: { status } });
        }
        counts.total = Object.values(counts).reduce((a, b) => a + b, 0);
        return counts;
    }
};
exports.ContractsService = ContractsService;
exports.ContractsService = ContractsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        finance_automation_service_1.FinanceAutomationService])
], ContractsService);
//# sourceMappingURL=contracts.service.js.map