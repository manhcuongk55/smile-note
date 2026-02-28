import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    const password = await bcrypt.hash('password123', 10);

    // 1. Organization
    const org = await prisma.organization.create({
        data: { name: 'Smile Note Management' }
    });

    // 2. User
    const manager = await prisma.user.create({
        data: {
            email: 'manager@smilehome.com',
            password,
            name: 'John Doe',
            role: 'MANAGER',
            organizationId: org.id
        }
    });

    // 3. Buildings
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

    // 4. Rooms
    const rooms: any[] = [];
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

    // 5. Tasks
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
