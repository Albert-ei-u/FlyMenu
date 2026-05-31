import { Body, Controller, Get, Patch, Param } from '@nestjs/common';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  status() {
    return this.settingsService.status();
  }

  @Get(':restaurantId')
  findForRestaurant(@Param('restaurantId') restaurantId: string) {
    return this.settingsService.findForRestaurant(restaurantId);
  }

  @Patch(':restaurantId')
  update(@Param('restaurantId') restaurantId: string, @Body() body: UpdateSettingsDto) {
    return this.settingsService.update(restaurantId, body);
  }
}
