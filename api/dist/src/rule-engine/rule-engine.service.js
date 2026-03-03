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
var RuleEngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngineService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RuleEngineService = RuleEngineService_1 = class RuleEngineService {
    prisma;
    logger = new common_1.Logger(RuleEngineService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async recordViolation(data) {
        const previousCount = await this.prisma.violation.count({
            where: {
                roomId: data.roomId,
                type: data.type,
            },
        });
        const currentCount = previousCount + 1;
        let amount = 0;
        if (data.type === 'ELECTRICITY') {
            if (currentCount === 2)
                amount = 50000;
            else if (currentCount === 3)
                amount = 100000;
            else if (currentCount >= 4)
                amount = 200000;
        }
        else if (data.type === 'LAUNDRY') {
            if (currentCount === 2)
                amount = 100000;
            else if (currentCount >= 4)
                amount = 500000;
        }
        const activeContract = await this.prisma.contract.findFirst({
            where: {
                roomId: data.roomId,
                status: { in: ['ACTIVE', 'CONTRACT_SIGNED'] },
            },
        });
        const violation = await this.prisma.violation.create({
            data: {
                roomId: data.roomId,
                contractId: activeContract?.id,
                type: data.type,
                count: currentCount,
                amount: amount,
                description: data.description || `${data.type} Violation #${currentCount}`,
            },
        });
        if (amount > 0) {
            await this.prisma.ledgerEntry.create({
                data: {
                    description: `Fine for ${data.type} Violation #${currentCount} (Room ${data.roomId})`,
                    amount: amount,
                    debitAccountId: '131',
                    creditAccountId: '711',
                    roomId: data.roomId,
                    contractId: activeContract?.id,
                },
            });
            this.logger.log(`Recorded fine of ${amount} for ${data.type} violation #${currentCount} in room ${data.roomId}`);
        }
        return violation;
    }
    async getViolations(roomId) {
        return this.prisma.violation.findMany({
            where: roomId ? { roomId } : {},
            orderBy: { createdAt: 'desc' },
            include: { room: true },
        });
    }
};
exports.RuleEngineService = RuleEngineService;
exports.RuleEngineService = RuleEngineService = RuleEngineService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RuleEngineService);
//# sourceMappingURL=rule-engine.service.js.map