import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Module status' })
  status() {
    return this.settingsService.status();
  }

  @Get(':restaurantId')
  @ApiOperation({ summary: 'Get restaurant settings', description: 'Retrieve custom configuration parameters (notification settings, profile options) for a restaurant.' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID (CUID).' })
  findForRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.settingsService.findForRestaurant(restaurantId);
  }

  @Patch(':restaurantId')
  @ApiOperation({ summary: 'Update restaurant settings', description: 'Update customized options for restaurant operating configurations.' })
  @ApiParam({ name: 'restaurantId', description: 'Restaurant ID (CUID).' })
  update(@Param('restaurantId') restaurantId: string, @Body() body: UpdateSettingsDto) {
    return this.settingsService.update(restaurantId, body);
  }
}

