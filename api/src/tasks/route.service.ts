import { Injectable } from '@nestjs/common';
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
    room: { id: string; number: string; floor: number } | null;
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
        room: { number: string; floor: number } | null;
    }[];
    distanceFromPrevKm: number;
}

@Injectable()
export class RouteService {
    constructor(private prisma: PrismaService) { }

    /**
     * Haversine distance between two GPS coordinates in kilometers
     */
    private haversineKm(
        lat1: number, lon1: number,
        lat2: number, lon2: number,
    ): number {
        const R = 6371; // Earth radius km
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private toRad(deg: number): number {
        return deg * (Math.PI / 180);
    }

    /**
     * Priority weight — URGENT buildings get pulled earlier in route
     */
    private priorityWeight(priority: string): number {
        switch (priority) {
            case 'URGENT': return 0.3;  // reduce effective distance by 70%
            case 'HIGH': return 0.6;
            case 'MEDIUM': return 1.0;
            case 'LOW': return 1.5;     // push further
            default: return 1.0;
        }
    }

    /**
     * Nearest-Neighbor TSP with priority weighting
     * 
     * Algorithm:
     * 1. Group tasks by building
     * 2. For each building, compute max priority (URGENT > HIGH > MEDIUM > LOW)
     * 3. Start from a virtual "current location" (first URGENT building, or nearest)
     * 4. Greedily pick next building = min(distance * priorityWeight)
     * 5. Within each building, sort tasks by: priority DESC, floor ASC
     */
    async getOptimizedRoute(managerId?: string) {
        const whereClause: any = {
            status: 'PENDING',
            deletedAt: null,
        };
        if (managerId) {
            whereClause.assignedManagerId = managerId;
        }

        const tasks = await this.prisma.task.findMany({
            where: whereClause,
            include: {
                building: true,
                room: true,
            },
        }) as unknown as TaskWithBuilding[];

        if (tasks.length === 0) {
            return { stops: [], totalDistanceKm: 0, estimatedMinutes: 0, taskCount: 0 };
        }

        // Group tasks by building
        const buildingMap = new Map<string, { building: TaskWithBuilding['building']; tasks: TaskWithBuilding[] }>();
        for (const task of tasks) {
            if (!buildingMap.has(task.buildingId)) {
                buildingMap.set(task.buildingId, { building: task.building, tasks: [] });
            }
            buildingMap.get(task.buildingId)!.tasks.push(task);
        }

        // Get max priority for each building
        const priorityRank = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const buildingEntries = Array.from(buildingMap.entries()).map(([id, data]) => {
            const maxPriority = data.tasks.reduce((max, t) => {
                const rank = priorityRank[t.priority as keyof typeof priorityRank] || 0;
                return rank > max.rank ? { priority: t.priority, rank } : max;
            }, { priority: 'LOW', rank: 0 });
            return { id, ...data, maxPriority: maxPriority.priority };
        });

        // Nearest-neighbor TSP with priority weighting
        const visited = new Set<string>();
        const route: typeof buildingEntries[0][] = [];

        // Start: pick the building with highest priority, break ties by latitude (northernmost first)
        buildingEntries.sort((a, b) => {
            const pa = priorityRank[a.maxPriority as keyof typeof priorityRank] || 0;
            const pb = priorityRank[b.maxPriority as keyof typeof priorityRank] || 0;
            if (pb !== pa) return pb - pa;
            return (b.building.latitude || 0) - (a.building.latitude || 0);
        });

        let current = buildingEntries[0];
        route.push(current);
        visited.add(current.id);

        // Greedily pick nearest unvisited (adjusted by priority)
        while (visited.size < buildingEntries.length) {
            let bestNext: typeof current | null = null;
            let bestScore = Infinity;

            for (const entry of buildingEntries) {
                if (visited.has(entry.id)) continue;
                if (!current.building.latitude || !entry.building.latitude) continue;

                const dist = this.haversineKm(
                    current.building.latitude, current.building.longitude!,
                    entry.building.latitude, entry.building.longitude!,
                );
                const score = dist * this.priorityWeight(entry.maxPriority);

                if (score < bestScore) {
                    bestScore = score;
                    bestNext = entry;
                }
            }

            if (bestNext) {
                route.push(bestNext);
                visited.add(bestNext.id);
                current = bestNext;
            } else {
                break;
            }
        }

        // Build response
        let totalDistanceKm = 0;
        let totalMinutes = 0;

        const stops: RouteStop[] = route.map((entry, index) => {
            let distFromPrev = 0;
            if (index > 0) {
                const prev = route[index - 1];
                if (prev.building.latitude && entry.building.latitude) {
                    distFromPrev = this.haversineKm(
                        prev.building.latitude, prev.building.longitude!,
                        entry.building.latitude, entry.building.longitude!,
                    );
                }
            }
            totalDistanceKm += distFromPrev;

            // Sort tasks within building: priority DESC, floor ASC
            const sortedTasks = entry.tasks.sort((a, b) => {
                const pa = priorityRank[a.priority as keyof typeof priorityRank] || 0;
                const pb = priorityRank[b.priority as keyof typeof priorityRank] || 0;
                if (pb !== pa) return pb - pa;
                return (a.room?.floor || 0) - (b.room?.floor || 0);
            });

            const taskMinutes = sortedTasks.reduce((sum, t) => sum + (t.estimatedDuration || 20), 0);
            const travelMinutes = distFromPrev * 3; // ~20km/h in HCMC traffic = 3 min/km
            totalMinutes += taskMinutes + travelMinutes;

            return {
                order: index + 1,
                building: {
                    id: entry.building.id,
                    name: entry.building.name,
                    address: entry.building.address,
                    latitude: entry.building.latitude,
                    longitude: entry.building.longitude,
                },
                tasks: sortedTasks.map(t => ({
                    id: t.id,
                    type: t.type,
                    priority: t.priority,
                    description: t.description,
                    estimatedDuration: t.estimatedDuration,
                    room: t.room ? { number: t.room.number, floor: t.room.floor } : null,
                })),
                distanceFromPrevKm: Math.round(distFromPrev * 100) / 100,
            };
        });

        return {
            stops,
            totalDistanceKm: Math.round(totalDistanceKm * 100) / 100,
            estimatedMinutes: Math.round(totalMinutes),
            taskCount: tasks.length,
        };
    }
}
