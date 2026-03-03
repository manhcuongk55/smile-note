import { PrismaService } from '../prisma/prisma.service';
export declare class BuildingsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(organizationId: string): Promise<({
        rooms: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        clusterId: string | null;
    })[]>;
    findOne(id: string): Promise<({
        rooms: {
            number: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            floor: number;
            status: string;
            buildingId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        clusterId: string | null;
    }) | null>;
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        clusterId: string | null;
    }>;
}
