import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('settings', 'Restaurant profile settings, contact details, operating hours, services, media, notification preferences, and security.');
  }

  findForRestaurant(restaurantId: string) {
    return this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      include: { settings: true, media: true },
    });
  }

  async update(restaurantId: string, body: UpdateSettingsDto) {
    await this.prisma.restaurant.update({
      where: { id: restaurantId },
      data: {
        name: body.restaurantName,
        email: body.email,
        phone: body.phone,
        addressLine: body.addressLine,
        services: body.services,
      },
    });

    return this.prisma.restaurantSetting.upsert({
      where: { restaurantId },
      create: {
        restaurantId,
        emailNotifications: body.emailNotifications ?? true,
        smsAlerts: body.smsAlerts ?? false,
        orderUpdates: body.orderUpdates ?? true,
      },
      update: {
        emailNotifications: body.emailNotifications,
        smsAlerts: body.smsAlerts,
        orderUpdates: body.orderUpdates,
      },
    });
  }
}
