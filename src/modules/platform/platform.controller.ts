import { Controller, Get, Header, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../common/auth/auth.guard';
import { Roles } from '../../common/auth/roles.decorator';
import { RolesGuard } from '../../common/auth/roles.guard';
import { PlatformService } from './platform.service';

@Controller('platform')
@UseGuards(AuthGuard, RolesGuard)
@Roles('SUPER_ADMIN')
export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  @Get()
  status() {
    return this.platformService.status();
  }

  @Get('dashboard')
  dashboard() {
    return this.platformService.dashboard();
  }

  @Get('restaurants')
  restaurants() {
    return this.platformService.restaurants();
  }

  @Get('restaurants/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="restaurants.csv"')
  restaurantsCsv() {
    return this.platformService.restaurantsCsv();
  }

  @Get('customers')
  customers() {
    return this.platformService.customers();
  }

  @Get('customers/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="customers.csv"')
  customersCsv() {
    return this.platformService.customersCsv();
  }

  @Get('revenue')
  revenue() {
    return this.platformService.revenue();
  }

  @Get('revenue/export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="revenue.csv"')
  revenueCsv() {
    return this.platformService.revenueCsv();
  }

  @Get('activity')
  activity() {
    return this.platformService.activity();
  }

  @Get('system-status')
  systemStatus() {
    return this.platformService.systemStatus();
  }
}
