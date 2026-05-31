import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('analytics', 'Dashboard metrics, sales trends, popular items, customer growth, and platform revenue snapshots.');
  }

  async dashboard(restaurantId?: string) {
    const orderFilter = restaurantId ? { restaurantId } : {};
    const [orders, customers, restaurants, recentOrders] = await Promise.all([
      this.prisma.order.aggregate({
        where: orderFilter,
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.customerProfile.count(),
      this.prisma.restaurant.count({ where: restaurantId ? { id: restaurantId } : undefined }),
      this.prisma.order.findMany({
        where: orderFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { items: true },
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
