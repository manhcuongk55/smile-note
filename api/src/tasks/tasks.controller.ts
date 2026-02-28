import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    async findAll(
        @Query('organizationId') organizationId: string,
        @Query('managerId') managerId?: string,
        @Query('buildingId') buildingId?: string,
    ) {
        return this.tasksService.findAll({ organizationId, managerId, buildingId });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Post()
    async create(@Body() body: any) {
        return this.tasksService.create(body);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() body: any) {
        return this.tasksService.update(id, body);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }

    @Post(':id/log')
    async logAction(
        @Param('id') id: string,
        @Body() body: { userId: string; action: string; payload?: any },
    ) {
        return this.tasksService.logAction(id, body.userId, body.action, body.payload);
    }
}
