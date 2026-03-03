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
var FinanceAutomationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceAutomationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let FinanceAutomationService = FinanceAutomationService_1 = class FinanceAutomationService {
    prisma;
    logger = new common_1.Logger(FinanceAutomationService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async calculateAndRecordCommission(contractId) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
            include: { manager: true },
        });
        if (!contract || !contract.monthlyRent || !contract.contractType) {
            this.logger.warn(`Contract ${contractId} missing data for commission calculation`);
            return;
        }
        let percentage = 0;
        switch (contract.contractType) {
            case '3M':
                percentage = 0.15;
                break;
            case '6M':
                percentage = 0.2;
                break;
            case '12M':
                percentage = 0.25;
                break;
            default:
                this.logger.warn(`Unknown contract type ${contract.contractType} for contract ${contractId}`);
                return;
        }
        const amount = contract.monthlyRent * percentage;
        await this.prisma.ledgerEntry.create({
            data: {
                description: `Commission for contract ${contractId} (${contract.contractType})`,
                amount,
                debitAccountId: '642',
                creditAccountId: '331',
                contractId: contract.id,
                buildingId: contract.buildingId,
                roomId: contract.roomId,
            },
        });
        this.logger.log(`Recorded commission of ${amount} for contract ${contractId}`);
    }
    async calculateAndRecordKPIBonus(managerId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        const contractCount = await this.prisma.contract.count({
            where: {
                managerId,
                status: 'CONTRACT_SIGNED',
                updatedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        if (contractCount < 3)
            return;
        let bonusPercentage = 0;
        if (contractCount >= 10) {
            bonusPercentage = 0.07;
        }
        else if (contractCount >= 3) {
            bonusPercentage = 0.05;
        }
        const contracts = await this.prisma.contract.findMany({
            where: {
                managerId,
                status: 'CONTRACT_SIGNED',
                updatedAt: {
                    gte: startDate,
                    lte: endDate,
                },
            },
        });
        const totalRent = contracts.reduce((sum, c) => sum + (c.monthlyRent || 0), 0);
        const bonusAmount = totalRent * bonusPercentage;
        if (bonusAmount > 0) {
            await this.prisma.ledgerEntry.create({
                data: {
                    description: `KPI Bonus for ${managerId} - ${year}/${month} (${contractCount} contracts)`,
                    amount: bonusAmount,
                    debitAccountId: '642',
                    creditAccountId: '331',
                },
            });
            this.logger.log(`Recorded KPI Bonus of ${bonusAmount} for manager ${managerId}`);
        }
    }
    async handleDepositCancellation(contractId, approved) {
        const contract = await this.prisma.contract.findUnique({
            where: { id: contractId },
        });
        if (!contract || !contract.depositAmount)
            return;
        const amount = contract.depositAmount;
        if (approved) {
            const splitAmount = amount / 2;
            await this.prisma.ledgerEntry.create({
                data: {
                    description: `Deposit split (50%) - House revenue for cancelled contract ${contractId}`,
                    amount: splitAmount,
                    debitAccountId: '3386',
                    creditAccountId: '711',
                    contractId: contract.id,
                },
            });
            await this.prisma.ledgerEntry.create({
                data: {
                    description: `Deposit split (50%) - Sale commission for cancelled contract ${contractId}`,
                    amount: splitAmount,
                    debitAccountId: '3386',
                    creditAccountId: '331',
                    contractId: contract.id,
                },
            });
        }
        else {
            await this.prisma.ledgerEntry.create({
                data: {
                    description: `Deposit forfeiture (100%) - House revenue for cancelled contract ${contractId}`,
                    amount,
                    debitAccountId: '3386',
                    creditAccountId: '711',
                    contractId: contract.id,
                },
            });
        }
    }
};
exports.FinanceAutomationService = FinanceAutomationService;
exports.FinanceAutomationService = FinanceAutomationService = FinanceAutomationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], FinanceAutomationService);
//# sourceMappingURL=finance-automation.service.js.map