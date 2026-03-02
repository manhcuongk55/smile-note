import { PrismaService } from '../prisma/prisma.service';
export interface TaskWithBuilding {
    id: string;
    type: string;
    priority: string;
    status: string;
    description: string | null;
    estimatedDuration: number | null;
    buildingId: string;
    roomId: string | null;
    building: {
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
    };
    room: {
        id: string;
        number: string;
        floor: number;
    } | null;
}
export interface RouteStop {
    order: number;
    building: {
        id: string;
        name: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
    };
    tasks: {
        id: string;
        type: string;
        priority: string;
        description: string | null;
        estimatedDuration: number | null;
        room: {
            number: string;
            floor: number;
        } | null;
    }[];
    distanceFromPrevKm: number;
}
export declare class RouteService {
    private prisma;
    constructor(prisma: PrismaService);
    private haversineKm;
    private toRad;
    private priorityWeight;
    getOptimizedRoute(managerId?: string): Promise<{
        stops: RouteStop[];
        totalDistanceKm: number;
        estimatedMinutes: number;
        taskCount: number;
    }>;
}
