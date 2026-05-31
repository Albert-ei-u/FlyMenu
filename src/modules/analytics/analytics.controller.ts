import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  status() {
    return this.analyticsService.status();
  }

  @Get('dashboard')
  dashboard(@Query('restaurantId') restaurantId?: string) {
    return this.analyticsService.dashboard(restaurantId);
  }
}
