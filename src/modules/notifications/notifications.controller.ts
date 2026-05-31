import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Post()
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }
}
