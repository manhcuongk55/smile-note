import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { RouteService } from './route.service';
import { RouteController } from './route.controller';

@Module({
    providers: [TasksService, RouteService],
    controllers: [TasksController, RouteController],
    exports: [TasksService, RouteService],
})
export class TasksModule { }
