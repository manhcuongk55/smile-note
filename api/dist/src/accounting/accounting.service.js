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
exports.AccountingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AccountingService = class AccountingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const cashDebit = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { debitAccountId: { in: ['111', '112'] } },
        });
        const cashCredit = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { creditAccountId: { in: ['111', '112'] } },
        });
        const totalCash = (cashDebit._sum.amount || 0) - (cashCredit._sum.amount || 0);
        const revenue = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { creditAccountId: '511' },
        });
        const arDebit = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { debitAccountId: '131' },
        });
        const arCredit = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { creditAccountId: '131' },
        });
        const accountsReceivable = (arDebit._sum.amount || 0) - (arCredit._sum.amount || 0);
        const depositCredit = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { creditAccountId: '3386' },
        });
        const depositDebit = await this.prisma.ledgerEntry.aggregate({
            _sum: { amount: true },
            where: { debitAccountId: '3386' },
        });
        const totalDeposits = (depositCredit._sum.amount || 0) - (depositDebit._sum.amount || 0);
        return {
            totalCash,
            monthlyRevenue: revenue._sum.amount || 0,
            accountsReceivable,
            totalDeposits,
            lastTransactions: await this.prisma.ledgerEntry.findMany({
                take: 10,
                orderBy: { date: 'desc' },
                include: {
                    debitAccount: { select: { name: true } },
                    creditAccount: { select: { name: true } },
                },
            }),
        };
    }
};
exports.AccountingService = AccountingService;
exports.AccountingService = AccountingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AccountingService);
//# sourceMappingURL=accounting.service.js.map