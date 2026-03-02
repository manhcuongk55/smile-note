"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.tenant.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.activityLog.deleteMany();
    await prisma.task.deleteMany();
    await prisma.room.deleteMany();
    await prisma.building.deleteMany();
    await prisma.user.deleteMany();
    await prisma.organization.deleteMany();
    const password = await bcrypt.hash('password123', 10);
    const org = await prisma.organization.create({
        data: { name: 'Smile Home HCMC' }
    });
    const manager = await prisma.user.create({
        data: {
            email: 'manager@smilehome.com',
            password,
            name: 'Nguyễn Văn An',
            role: 'MANAGER',
            organizationId: org.id
        }
    });
    await prisma.user.create({
        data: {
            email: 'tech@smilehome.com',
            password,
            name: 'Trần Minh Tuấn',
            role: 'TECHNICIAN',
            organizationId: org.id
        }
    });
    const buildings = await Promise.all([
        prisma.building.create({
            data: {
                name: 'Vinhomes Central Park',
                address: '208 Nguyễn Hữu Cảnh, Bình Thạnh',
                latitude: 10.7942, longitude: 106.7222,
                organizationId: org.id
            }
        }),
        prisma.building.create({
            data: {
                name: 'Sunrise City',
                address: '25 Nguyễn Hữu Thọ, Quận 7',
                latitude: 10.7340, longitude: 106.7010,
                organizationId: org.id
            }
        }),
        prisma.building.create({
            data: {
                name: 'The Manor',
                address: '91 Nguyễn Hữu Cảnh, Bình Thạnh',
                latitude: 10.7900, longitude: 106.7180,
                organizationId: org.id
            }
        }),
        prisma.building.create({
            data: {
                name: 'Masteri Thảo Điền',
                address: '159 Xa lộ Hà Nội, Thủ Đức',
                latitude: 10.8025, longitude: 106.7430,
                organizationId: org.id
            }
        }),
        prisma.building.create({
            data: {
                name: 'Saigon Pearl',
                address: '92 Nguyễn Hữu Cảnh, Bình Thạnh',
                latitude: 10.7870, longitude: 106.7150,
                organizationId: org.id
            }
        }),
        prisma.building.create({
            data: {
                name: 'Landmark 81',
                address: '720A Điện Biên Phủ, Bình Thạnh',
                latitude: 10.7950, longitude: 106.7218,
                organizationId: org.id
            }
        }),
    ]);
    const [vinhomes, sunrise, manor, masteri, pearl, landmark] = buildings;
    const allRooms = [];
    for (const b of buildings) {
        for (let floor = 1; floor <= 3; floor++) {
            for (let unit = 1; unit <= 2; unit++) {
                const room = await prisma.room.create({
                    data: {
                        number: `${floor}0${unit}`,
                        floor,
                        buildingId: b.id,
                        status: unit === 1 ? 'OCCUPIED' : (floor === 3 ? 'MAINTENANCE' : 'VACANT'),
                    }
                });
                allRooms.push({ ...room, buildingId: b.id });
            }
        }
    }
    const getRoomFor = (buildingId, floor) => allRooms.find(r => r.buildingId === buildingId && r.floor === floor);
    const taskData = [
        { type: 'MAINTENANCE_CHECK', priority: 'URGENT', description: 'Rò rỉ nước toilet tầng 2 — cư dân gọi gấp', building: masteri, floor: 2 },
        { type: 'MAINTENANCE_CHECK', priority: 'URGENT', description: 'Mất điện toàn bộ căn hộ 301', building: sunrise, floor: 3 },
        { type: 'PAYMENT_COLLECTION', priority: 'HIGH', description: 'Thu tiền thuê tháng 3 — đã nhắc 2 lần', building: vinhomes, floor: 1 },
        { type: 'ROOM_INSPECTION', priority: 'HIGH', description: 'Kiểm tra trước khi khách mới nhận phòng', building: landmark, floor: 2 },
        { type: 'FOLLOW_UP', priority: 'HIGH', description: 'Follow-up khiếu nại tiếng ồn ban đêm', building: pearl, floor: 1 },
        { type: 'SHOW_ROOM', priority: 'MEDIUM', description: 'Dẫn khách xem phòng trống tầng 2', building: manor, floor: 2 },
        { type: 'MOVE_IN', priority: 'MEDIUM', description: 'Bàn giao phòng 102 cho khách mới', building: vinhomes, floor: 1 },
        { type: 'MAINTENANCE_SUPERVISION', priority: 'MEDIUM', description: 'Giám sát thợ sửa điều hoà', building: masteri, floor: 1 },
        { type: 'MOVE_OUT', priority: 'MEDIUM', description: 'Kiểm tra phòng trả — checklist trước bàn giao', building: sunrise, floor: 1 },
        { type: 'ROOM_INSPECTION', priority: 'LOW', description: 'Kiểm tra định kỳ hệ thống PCCC', building: landmark, floor: 3 },
        { type: 'FOLLOW_UP', priority: 'LOW', description: 'Gửi báo giá sửa chữa cho cư dân', building: pearl, floor: 2 },
        { type: 'MAINTENANCE_CHECK', priority: 'LOW', description: 'Check van nước chung tầng 3', building: manor, floor: 3 },
    ];
    const now = new Date();
    for (const t of taskData) {
        const room = getRoomFor(t.building.id, t.floor);
        await prisma.task.create({
            data: {
                type: t.type,
                priority: t.priority,
                status: 'PENDING',
                description: t.description,
                organizationId: org.id,
                buildingId: t.building.id,
                roomId: room?.id || null,
                assignedManagerId: manager.id,
                scheduledTime: now,
                estimatedDuration: t.priority === 'URGENT' ? 15 : t.priority === 'HIGH' ? 20 : 30,
            }
        });
    }
    const vacantRooms = allRooms.filter(r => r.status === 'VACANT');
    await prisma.contract.create({
        data: {
            status: 'ACTIVE',
            monthlyRent: 8000000,
            depositAmount: 16000000,
            depositDate: new Date('2024-12-15'),
            moveInDate: new Date('2025-01-01'),
            startDate: new Date('2025-01-01'),
            endDate: new Date('2026-01-01'),
            contractImages: JSON.stringify(['/uploads/contract-001-p1.jpg', '/uploads/contract-001-p2.jpg']),
            notes: '[01/01/2025] Khách nhận phòng, bàn giao đầy đủ\n[15/02/2025] Khách yêu cầu sửa vòi nước',
            organizationId: org.id,
            buildingId: vinhomes.id,
            roomId: vacantRooms[0]?.id || allRooms[0].id,
            managerId: manager.id,
            tenants: {
                create: [
                    { name: 'Trần Thị Mai', phone: '0987654321', idCard: '079201001234', isRepresentative: true },
                    { name: 'Trần Văn Bình', notes: 'Chồng, ở cùng' },
                ]
            }
        }
    });
    await prisma.contract.create({
        data: {
            status: 'DEPOSITED',
            monthlyRent: 6500000,
            depositAmount: 13000000,
            depositDate: new Date('2026-02-25'),
            moveInDate: new Date('2026-03-05'),
            organizationId: org.id,
            buildingId: masteri.id,
            roomId: vacantRooms[1]?.id || allRooms[2].id,
            managerId: manager.id,
            tenants: {
                create: [
                    { name: 'Lê Hoàng Nam', phone: '0912345678', idCard: '079302006789', isRepresentative: true },
                ]
            }
        }
    });
    await prisma.contract.create({
        data: {
            status: 'CONSULTING',
            monthlyRent: 7000000,
            notes: 'Khách hỏi qua Zalo, muốn xem phòng tầng 2',
            organizationId: org.id,
            buildingId: pearl.id,
            roomId: vacantRooms[2]?.id || allRooms[4].id,
            managerId: manager.id,
            tenants: {
                create: [
                    { name: 'Phạm Minh Tú', phone: '0901234567', isRepresentative: true },
                ]
            }
        }
    });
    await prisma.contract.create({
        data: {
            status: 'ENDED',
            monthlyRent: 5500000,
            depositAmount: 11000000,
            depositDate: new Date('2024-06-01'),
            startDate: new Date('2024-06-15'),
            endDate: new Date('2025-06-15'),
            contractImages: JSON.stringify(['/uploads/contract-004.jpg']),
            notes: '[15/06/2024] Nhận phòng\n[15/06/2025] Trả phòng, hoàn cọc đầy đủ',
            organizationId: org.id,
            buildingId: sunrise.id,
            roomId: vacantRooms[3]?.id || allRooms[6].id,
            managerId: manager.id,
            tenants: {
                create: [
                    { name: 'Nguyễn Thanh Hà', phone: '0978123456', idCard: '079199012345', isRepresentative: true },
                ]
            }
        }
    });
    console.log(`✅ Seeded: ${buildings.length} buildings, ${allRooms.length} rooms, ${taskData.length} tasks, 4 contracts`);
}
main()
    .catch((e) => {
    console.error('SEED ERROR:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map