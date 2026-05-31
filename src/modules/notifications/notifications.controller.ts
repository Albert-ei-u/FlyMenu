import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsService } from './notifications.service';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List notifications', description: 'Retrieve history of all system notifications.' })
  findAll() {
    return this.notificationsService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create & push notification', description: 'Publish a notification to a specific user. Sends a real-time event via WebSocket.' })
  create(@Body() body: CreateNotificationDto) {
    return this.notificationsService.create(body);
  }
}

