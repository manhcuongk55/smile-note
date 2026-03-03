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
var ComplianceService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ComplianceService = ComplianceService_1 = class ComplianceService {
    prisma;
    logger = new common_1.Logger(ComplianceService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPCCCChecklist(buildingId) {
        const buildings = await this.prisma.building.findMany({
            where: buildingId ? { id: buildingId } : {},
            include: { organization: true },
        });
        const now = new Date();
        const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        return buildings.map((building) => {
            const lastCheck = building.updatedAt;
            const isOverdue = lastCheck < ninetyDaysAgo;
            return {
                buildingId: building.id,
                buildingName: building.name,
                address: building.address,
                lastInspection: lastCheck,
                nextInspection: new Date(lastCheck.getTime() + 90 * 24 * 60 * 60 * 1000),
                isOverdue,
                status: isOverdue ? 'URGENT' : 'OK',
            };
        });
    }
    async syncResidentData(contractId, residentData) {
        this.logger.log(`Syncing resident data for contract ${contractId}`);
        const tenant = await this.prisma.tenant.upsert({
            where: {
                id: (await this.prisma.tenant.findFirst({
                    where: { contractId, idCard: residentData.idCard },
                }))?.id || 'new-id-' + Date.now(),
            },
            update: {
                name: residentData.name,
                phone: residentData.phone,
                email: residentData.email,
            },
            create: {
                contractId,
                name: residentData.name,
                idCard: residentData.idCard,
                phone: residentData.phone,
                email: residentData.email,
                isRepresentative: false,
            },
        });
        return tenant;
    }
    async processDigitalContract(contractId, ocrResult) {
        this.logger.log(`Processing digital sync for contract ${contractId}`);
        const tenantName = ocrResult?.name;
        const depositAmount = ocrResult?.deposit;
        if (tenantName) {
            await this.prisma.contract.update({
                where: { id: contractId },
                data: {
                    notes: `[Digital_Sync] Matched tenant ${tenantName} from OCR`,
                    status: 'CONTRACT_SIGNED',
                },
            });
        }
        return { success: true, matchedCount: tenantName ? 1 : 0 };
    }
};
exports.ComplianceService = ComplianceService;
exports.ComplianceService = ComplianceService = ComplianceService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ComplianceService);
//# sourceMappingURL=compliance.service.js.map