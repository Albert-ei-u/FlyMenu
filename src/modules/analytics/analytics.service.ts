import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../../common/auth/current-user';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('analytics', 'Dashboard metrics, sales trends, popular items, customer growth, and platform revenue snapshots.');
  }

  async dashboard(user?: CurrentUser, restaurantId?: string) {
    let targetRestaurantId = restaurantId;

    if (user && user.role === 'RESTAURANT_OWNER' && !restaurantId) {
      const owned = await this.prisma.restaurant.findFirst({
        where: { ownerId: user.sub },
        select: { id: true },
      });
      if (owned) {
        targetRestaurantId = owned.id;
      } else {
        // Owner has no restaurant created yet
        return { salesTotal: 0, totalOrders: 0, totalCustomers: 0, totalRestaurants: 0, recentOrders: [] };
      }
    }

    const orderFilter = targetRestaurantId ? { restaurantId: targetRestaurantId } : {};
    const [orders, customers, restaurants, recentOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: orderFilter,
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.customerProfile.count(),
      this.prisma.restaurant.count({ where: targetRestaurantId ? { id: targetRestaurantId } : undefined }),
      this.prisma.order.findMany({
        where: orderFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          items: true,
          customer: { select: { fullName: true, email: true } },
        },
      }),
    ]);

    return {
      salesTotal: orders._sum.total ?? 0,
      totalOrders: orders._count.id,
      totalCustomers: customers,
      totalRestaurants: restaurants,
      recentOrders,
    };
  }
}
