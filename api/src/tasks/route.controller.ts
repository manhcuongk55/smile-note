import { Controller, Get, Query } from '@nestjs/common';
import { RouteService } from './route.service';

@Controller('route')
export class RouteController {
  constructor(private readonly routeService: RouteService) {}

  @Get('today')
  async getTodayRoute(@Query('managerId') managerId: string) {
    return this.routeService.getOptimizedRoute(managerId);
  }
}
