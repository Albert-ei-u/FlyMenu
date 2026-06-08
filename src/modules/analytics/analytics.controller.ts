import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { Request } from 'express';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user';

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
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Dashboard metrics', description: 'Fetch system-wide or restaurant-specific dashboard metrics including active orders, reservations, and sales.' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Optional restaurant ID to filter metrics. If not provided and user is RESTAURANT_OWNER, defaults to their own restaurant.' })
  dashboard(@Req() req: Request & { user?: CurrentUser }, @Query('restaurantId') restaurantId?: string) {
    return this.analyticsService.dashboard(req.user, restaurantId);
  }
}

