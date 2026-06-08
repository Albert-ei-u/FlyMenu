import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('customers', 'Customer accounts for the public FlyMenu experience and platform management.');
  }

  findAll() {
    return this.prisma.customerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, fullName: true, email: true, phone: true, status: true } } },
    });
  }

  findOne(id: string) {
    return this.prisma.customerProfile.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, fullName: true, email: true, phone: true, status: true } },
        restaurants: { include: { restaurant: true } },
      },
    });

  }
  async orders(id: string) {
    const profile = await this.prisma.customerProfile.findUniqueOrThrow({ where: { id } });

    return this.prisma.order.findMany({
      where: { customerId: profile.userId },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true, cuisine: true } },
        items: true,
        trackingEvents: { orderBy: { createdAt: 'asc' } },
      },
    });
  }

  async reservations(id: string) {
    const profile = await this.prisma.customerProfile.findUniqueOrThrow({ where: { id } });

    return this.prisma.reservation.findMany({
      where: { customerId: profile.userId },
      orderBy: { reservationDate: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true, addressLine: true, city: true } },
        table: true,
      },
    });
  }

  async favorites(id: string) {
    const profile = await this.prisma.customerProfile.findUniqueOrThrow({ where: { id } });

    return this.prisma.favoriteRestaurant.findMany({
      where: { userId: profile.userId },
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { include: { media: true } } },
    });
  }
}
