import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get()
  @ApiOperation({ summary: 'Module status', description: 'Returns connection status and configuration metrics for analytics.' })
  status() {
    return this.analyticsService.status();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard metrics', description: 'Fetch system-wide or restaurant-specific dashboard metrics including active orders, reservations, and sales.' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Optional restaurant ID to filter metrics.' })
  dashboard(@Query('restaurantId') restaurantId?: string) {
    return this.analyticsService.dashboard(restaurantId);
  }
}

