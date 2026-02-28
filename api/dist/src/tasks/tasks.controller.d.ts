import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    findAll(organizationId: string, managerId?: string, buildingId?: string): Promise<any>;
    findOne(id: string): Promise<any>;
    create(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
    logAction(id: string, body: {
        userId: string;
        action: string;
        payload?: any;
    }): Promise<any>;
}
