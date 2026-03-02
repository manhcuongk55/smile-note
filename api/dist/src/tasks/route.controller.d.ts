import { RouteService } from './route.service';
export declare class RouteController {
    private readonly routeService;
    constructor(routeService: RouteService);
    getTodayRoute(managerId: string): Promise<{
        stops: import("./route.service").RouteStop[];
        totalDistanceKm: number;
        estimatedMinutes: number;
        taskCount: number;
    }>;
}
