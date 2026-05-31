import { Injectable } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  status() {
    return moduleStatus('notifications', 'User notifications for orders, bookings, applications, system status, and admin events.');
  }

  findAll() {
    return this.prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async create(body: CreateNotificationDto) {
    const notification = await this.prisma.notification.create({
      data: {
        userId: body.userId,
        title: body.title,
        body: body.body,
        type: (body.type ?? 'SYSTEM') as NotificationType,
        actionUrl: body.actionUrl,
      },
    });

    this.realtime.emitNotification(notification);
    return notification;
  }
}
