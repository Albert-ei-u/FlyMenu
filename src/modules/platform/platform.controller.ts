import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/auth/auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { PlatformService } from './platform.service';

@ApiTags('Platform')
@ApiBearerAuth('access-token')
@Controller('platform')
@UseGuards(AuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  @ApiOperation({ summary: 'Module status' })
  status() {
    return this.platformService.status();
  }

  @Get('dashboard')
  @ApiOperation({ summary: 'Super-admin dashboard metrics', description: 'Get platform-wide key metrics: revenue stats, total active users, onboarding apps queue, and active issues.' })
  dashboard() {
    return this.platformService.dashboard();
  }

  @Get('restaurants')
  @ApiOperation({ summary: 'List all platform restaurants', description: 'Retrieve every restaurant registered on the platform.' })
  restaurants() {
    return this.platformService.restaurants();
  }

  @Get('restaurants/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="restaurants.csv"')
  @ApiOperation({ summary: 'Export restaurants CSV', description: 'Download CSV audit of all system restaurants.' })
  restaurantsCsv() {
    return this.platformService.restaurantsCsv();
  }

  @Get('customers')
  @ApiOperation({ summary: 'List all platform customers', description: 'Retrieve every customer profile registered.' })
  customers() {
    return this.platformService.customers();
  }

  @Get('customers/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="customers.csv"')
  @ApiOperation({ summary: 'Export customers CSV', description: 'Download CSV list of all system customers.' })
  customersCsv() {
    return this.platformService.customersCsv();
  }

  @Get('revenue')
  @ApiOperation({ summary: 'Get revenue logs', description: 'Get logs of all platform invoices, commissions, and transaction receipts.' })
  revenue() {
    return this.platformService.revenue();
  }

  @Get('revenue/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="revenue.csv"')
  @ApiOperation({ summary: 'Export revenue CSV', description: 'Download CSV invoice audit trail.' })
  revenueCsv() {
    return this.platformService.revenueCsv();
  }

  @Get('activity')
  @ApiOperation({ summary: 'Platform activity log', description: 'Fetch system audit logs of admin activities.' })
  activity() {
    return this.platformService.activity();
  }

  @Get('system-status')
  @ApiOperation({ summary: 'System component status', description: 'Check database, gateway, and core integration services health.' })
  systemStatus() {
    return this.platformService.systemStatus();
  }
}

