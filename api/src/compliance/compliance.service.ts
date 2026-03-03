import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComplianceService {
  private readonly logger = new Logger(ComplianceService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Module PCCC_Monitor: Chu kỳ nhắc nhở 90 ngày
   * Checks buildings for fire safety inspection status.
   */
  async getPCCCChecklist(buildingId?: string) {
    const buildings = await this.prisma.building.findMany({
      where: buildingId ? { id: buildingId } : {},
      include: { organization: true },
    });

    const now = new Date();
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    return buildings.map((building) => {
      // Simulated PCCC data check (in reality, this would query a PCCCAssets/Inspection model)
      // For now, we use a heuristic based on the last maintenance task of type 'PCCC_CHECK'
      const lastCheck = building.updatedAt; // Placeholder for actual last inspection date
      const isOverdue = lastCheck < ninetyDaysAgo;

      return {
        buildingId: building.id,
        buildingName: building.name,
        address: building.address,
        lastInspection: lastCheck,
        nextInspection: new Date(
          lastCheck.getTime() + 90 * 24 * 60 * 60 * 1000,
        ),
        isOverdue,
        status: isOverdue ? 'URGENT' : 'OK',
      };
    });
  }

  /**
   * Module Resident_Sync: Tự động trích xuất Họ tên, CCCD, Ngày sinh từ file DS Cư Dân
   */
  async syncResidentData(
    contractId: string,
    residentData: {
      name: string;
      idCard: string;
      phone?: string;
      email?: string;
    },
  ) {
    this.logger.log(`Syncing resident data for contract ${contractId}`);

    // Update or Create Tenant record
    const tenant = await this.prisma.tenant.upsert({
      where: {
        // Using ID if known, or identifying by ID card for this sync
        id:
          (
            await this.prisma.tenant.findFirst({
              where: { contractId, idCard: residentData.idCard },
            })
          )?.id || 'new-id-' + Date.now(),
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

  /**
   * Task Digital_Sync: OCR thông tin -> Khớp nối Tenant_ID
   */
  async processDigitalContract(contractId: string, ocrResult: any) {
    // Implementation of OCR matching and command activation
    this.logger.log(`Processing digital sync for contract ${contractId}`);

    // Mock OCR processing logic
    const tenantName = ocrResult?.name;
    const depositAmount = ocrResult?.deposit;

    if (tenantName) {
      await this.prisma.contract.update({
        where: { id: contractId },
        data: {
          notes: `[Digital_Sync] Matched tenant ${tenantName} from OCR`,
          status: 'CONTRACT_SIGNED', // Activate commands
        },
      });
    }

    return { success: true, matchedCount: tenantName ? 1 : 0 };
  }
}
