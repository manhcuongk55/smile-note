import { RouteService } from './route.service';
export declare class RouteController {
    private readonly routeService;
    constructor(routeService: RouteService);
    getTodayRoute(managerId: string): Promise<any>;
}
