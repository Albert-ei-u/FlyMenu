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
    const customerFilter = targetRestaurantId ? { restaurants: { some: { restaurantId: targetRestaurantId } } } : {};
    
    // Get last 24 hours sales trend
    const yesterday = new Date();
    yesterday.setHours(yesterday.getHours() - 24);

    const [orders, customers, restaurants, recentOrders, recentReservations, hourlySales] = await Promise.all([
      this.prisma.order.aggregate({
        where: orderFilter,
        _count: { id: true },
        _sum: { total: true },
      }),
      this.prisma.customerProfile.count({ where: customerFilter }),
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
      this.prisma.reservation.findMany({
        where: orderFilter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          table: true,
        },
      }),
      this.prisma.order.findMany({
        where: {
          ...orderFilter,
          createdAt: { gte: yesterday },
        },
        select: {
          total: true,
          createdAt: true,
        },
      }),
    ]);

    // Group hourly sales
    const salesByHour = new Array(24).fill(0).map((_, i) => {
      const date = new Date();
      date.setHours(date.getHours() - (23 - i), 0, 0, 0);
      return {
        label: date.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        value: 0,
        timestamp: date.getTime(),
      };
    });

    hourlySales.forEach(order => {
      const orderDate = new Date(order.createdAt);
      orderDate.setMinutes(0, 0, 0);
      const hourIndex = salesByHour.findIndex(h => h.timestamp === orderDate.getTime());
      if (hourIndex !== -1) {
        salesByHour[hourIndex].value += Number(order.total);
      }
    });

    // Normalize values for the chart (0-100 scale based on max value)
    const maxVal = Math.max(...salesByHour.map(s => s.value), 1);
    const salesTrend = salesByHour.map(s => ({
      label: s.label,
      value: Math.round((s.value / maxVal) * 100),
      actualValue: s.value,
    })).filter((_, i) => i % 4 === 0); // Show fewer labels on frontend

    return {
      salesTotal: orders._sum.total ?? 0,
      totalOrders: orders._count.id,
      totalCustomers: customers,
      totalRestaurants: restaurants,
      recentOrders,
      recentReservations,
      salesTrend,
    };
  }
}
