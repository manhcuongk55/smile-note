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
    const password = await bcrypt.hash('password123', 10);
    const org = await prisma.organization.create({
        data: { name: 'Smile Note Management' }
    });
    const manager = await prisma.user.create({
        data: {
            email: 'manager@smilehome.com',
            password,
            name: 'John Doe',
            role: 'MANAGER',
            organizationId: org.id
        }
    });
    const b1 = await prisma.building.create({
        data: {
            name: 'North Tower',
            address: '123 Sky St',
            latitude: 40.7128,
            longitude: -74.0060,
            organizationId: org.id
        }
    });
    const b2 = await prisma.building.create({
        data: {
            name: 'South Plaza',
            address: '456 Garden Ave',
            latitude: 40.7138,
            longitude: -74.0070,
            organizationId: org.id
        }
    });
    const rooms = [];
    for (let i = 1; i <= 5; i++) {
        const room = await prisma.room.create({
            data: {
                number: `30${i}`,
                floor: 3,
                buildingId: b1.id,
                status: 'OCCUPIED'
            }
        });
        rooms.push(room);
    }
    await prisma.task.create({
        data: {
            type: 'MAINTENANCE_CHECK',
            priority: 'URGENT',
            status: 'PENDING',
            description: 'Water leak reported in bathroom',
            organizationId: org.id,
            buildingId: b1.id,
            roomId: rooms[0].id,
            assignedManagerId: manager.id,
            scheduledTime: new Date()
        }
    });
    await prisma.task.create({
        data: {
            type: 'SHOW_ROOM',
            priority: 'MEDIUM',
            status: 'PENDING',
            description: 'Prospective tenant viewing',
            organizationId: org.id,
            buildingId: b1.id,
            roomId: rooms[1].id,
            assignedManagerId: manager.id,
            scheduledTime: new Date()
        }
    });
    console.log('Seed data created successfully');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map