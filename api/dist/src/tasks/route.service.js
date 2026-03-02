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
exports.RouteService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RouteService = class RouteService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    haversineKm(lat1, lon1, lat2, lon2) {
        const R = 6371;
        const dLat = this.toRad(lat2 - lat1);
        const dLon = this.toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
                Math.sin(dLon / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
    toRad(deg) {
        return deg * (Math.PI / 180);
    }
    priorityWeight(priority) {
        switch (priority) {
            case 'URGENT': return 0.3;
            case 'HIGH': return 0.6;
            case 'MEDIUM': return 1.0;
            case 'LOW': return 1.5;
            default: return 1.0;
        }
    }
    async getOptimizedRoute(managerId) {
        const whereClause = {
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
        });
        if (tasks.length === 0) {
            return { stops: [], totalDistanceKm: 0, estimatedMinutes: 0, taskCount: 0 };
        }
        const buildingMap = new Map();
        for (const task of tasks) {
            if (!buildingMap.has(task.buildingId)) {
                buildingMap.set(task.buildingId, { building: task.building, tasks: [] });
            }
            buildingMap.get(task.buildingId).tasks.push(task);
        }
        const priorityRank = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
        const buildingEntries = Array.from(buildingMap.entries()).map(([id, data]) => {
            const maxPriority = data.tasks.reduce((max, t) => {
                const rank = priorityRank[t.priority] || 0;
                return rank > max.rank ? { priority: t.priority, rank } : max;
            }, { priority: 'LOW', rank: 0 });
            return { id, ...data, maxPriority: maxPriority.priority };
        });
        const visited = new Set();
        const route = [];
        buildingEntries.sort((a, b) => {
            const pa = priorityRank[a.maxPriority] || 0;
            const pb = priorityRank[b.maxPriority] || 0;
            if (pb !== pa)
                return pb - pa;
            return (b.building.latitude || 0) - (a.building.latitude || 0);
        });
        let current = buildingEntries[0];
        route.push(current);
        visited.add(current.id);
        while (visited.size < buildingEntries.length) {
            let bestNext = null;
            let bestScore = Infinity;
            for (const entry of buildingEntries) {
                if (visited.has(entry.id))
                    continue;
                if (!current.building.latitude || !entry.building.latitude)
                    continue;
                const dist = this.haversineKm(current.building.latitude, current.building.longitude, entry.building.latitude, entry.building.longitude);
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
            }
            else {
                break;
            }
        }
        let totalDistanceKm = 0;
        let totalMinutes = 0;
        const stops = route.map((entry, index) => {
            let distFromPrev = 0;
            if (index > 0) {
                const prev = route[index - 1];
                if (prev.building.latitude && entry.building.latitude) {
                    distFromPrev = this.haversineKm(prev.building.latitude, prev.building.longitude, entry.building.latitude, entry.building.longitude);
                }
            }
            totalDistanceKm += distFromPrev;
            const sortedTasks = entry.tasks.sort((a, b) => {
                const pa = priorityRank[a.priority] || 0;
                const pb = priorityRank[b.priority] || 0;
                if (pb !== pa)
                    return pb - pa;
                return (a.room?.floor || 0) - (b.room?.floor || 0);
            });
            const taskMinutes = sortedTasks.reduce((sum, t) => sum + (t.estimatedDuration || 20), 0);
            const travelMinutes = distFromPrev * 3;
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
};
exports.RouteService = RouteService;
exports.RouteService = RouteService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RouteService);
//# sourceMappingURL=route.service.js.map