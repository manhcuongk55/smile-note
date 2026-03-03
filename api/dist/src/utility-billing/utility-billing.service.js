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
var UtilityBillingService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilityBillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UtilityBillingService = UtilityBillingService_1 = class UtilityBillingService {
    prisma;
    logger = new common_1.Logger(UtilityBillingService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generateInvoiceFromReadings(roomId, month, year) {
        const readings = await this.prisma.utilityReading.findMany({
            where: { roomId },
            orderBy: { readingDate: 'desc' },
            take: 2,
        });
        if (readings.length < 1) {
            throw new Error('No meter readings found for room');
        }
        const currentReading = readings[0];
        const usage = currentReading.currentValue - currentReading.previousValue;
        const contract = await this.prisma.contract.findFirst({
            where: {
                roomId,
                status: { in: ['ACTIVE', 'CONTRACT_SIGNED'] },
            },
            include: { tenants: true },
        });
        if (!contract) {
            throw new Error('No active contract found for room');
        }
        const electricityRate = 4000;
        const waterRate = 30000;
        let totalAmount = 0;
        if (currentReading.type === 'ELECTRICITY') {
            totalAmount = usage * electricityRate;
        }
        else if (currentReading.type === 'WATER') {
            totalAmount = usage * waterRate;
        }
        const invoice = await this.prisma.invoice.create({
            data: {
                contractId: contract.id,
                totalAmount: totalAmount,
                dueDate: new Date(year, month, 5),
                period: `${year}-${month.toString().padStart(2, '0')}`,
                status: 'DRAFT',
            },
        });
        await this.prisma.ledgerEntry.create({
            data: {
                description: `Utility Revenue - Room ${roomId} (${currentReading.type})`,
                amount: totalAmount,
                debitAccountId: '131',
                creditAccountId: '511',
                contractId: contract.id,
                buildingId: contract.buildingId,
                roomId: contract.roomId,
                invoiceId: invoice.id,
            },
        });
        this.logger.log(`Generated utility invoice ${invoice.id} for room ${roomId}`);
        return invoice;
    }
};
exports.UtilityBillingService = UtilityBillingService;
exports.UtilityBillingService = UtilityBillingService = UtilityBillingService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UtilityBillingService);
//# sourceMappingURL=utility-billing.service.js.map