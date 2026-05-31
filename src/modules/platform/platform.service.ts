import { Injectable } from '@nestjs/common';
import { toCsv } from '../../common/csv';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlatformService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('platform', 'Super-admin dashboards, restaurant approvals, customer management, revenue analytics, and system activity.');
  }

  async dashboard() {
    const [totalRestaurants, pendingApprovals, activeRestaurants, totalCustomers, revenue] = await Promise.all([
      this.prisma.restaurant.count(),
      this.prisma.restaurantApplication.count({ where: { status: { in: ['NEW', 'UNDER_REVIEW'] } } }),
      this.prisma.restaurant.count({ where: { status: 'ACTIVE' } }),
      this.prisma.customerProfile.count(),
      this.prisma.order.aggregate({ _sum: { total: true } }),
    ]);

    return {
      totalRestaurants,
      pendingApprovals,
      activeRestaurants,
      totalCustomers,
      platformRevenue: revenue._sum.total ?? 0,
    };
  }

  restaurants() {
    return this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { id: true, fullName: true, email: true } } },
    });
  }

  async restaurantsCsv() {
    const restaurants = await this.prisma.restaurant.findMany({
      orderBy: { createdAt: 'desc' },
      include: { owner: { select: { fullName: true, email: true } } },
    });

    return toCsv(
      restaurants.map((restaurant) => ({
        name: restaurant.name,
        owner: restaurant.owner.fullName,
        ownerEmail: restaurant.owner.email,
        cuisine: restaurant.cuisine,
        city: restaurant.city,
        status: restaurant.status,
        createdAt: restaurant.createdAt.toISOString(),
      })),
    );
  }

  customers() {
    return this.prisma.customerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, fullName: true, email: true, status: true } } },
    });
  }

  async customersCsv() {
    const customers = await this.prisma.customerProfile.findMany({
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true, phone: true, status: true } } },
    });

    return toCsv(
      customers.map((customer) => ({
        name: customer.user.fullName,
        email: customer.user.email,
        phone: customer.user.phone,
        status: customer.user.status,
        loyaltyTier: customer.loyaltyTier,
        createdAt: customer.createdAt.toISOString(),
      })),
    );
  }

  async revenue() {
    const [totalRevenue, recentTransactions] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { total: true }, _count: { id: true } }),
      this.prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, orderNumber: true, total: true, status: true, createdAt: true, restaurant: { select: { name: true } } },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.total ?? 0,
      transactionCount: totalRevenue._count.id,
      recentTransactions,
    };
  }

  async revenueCsv() {
    const orders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true } } },
    });

    return toCsv(
      orders.map((order) => ({
        orderNumber: order.orderNumber,
        restaurant: order.restaurant.name,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt.toISOString(),
      })),
    );
  }

  activity() {
    return this.prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25,
      include: {
        actor: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
    });
  }

  async systemStatus() {
    const [restaurants, openIncidents, activeOrders] = await Promise.all([
      this.prisma.restaurant.count({ where: { status: 'ACTIVE' } }),
      this.prisma.operationalIncident.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
      this.prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } } }),
    ]);

    return {
      status: openIncidents > 0 ? 'ATTENTION_REQUIRED' : 'OPTIMAL',
      activeRestaurants: restaurants,
      openIncidents,
      activeOrders,
      checkedAt: new Date().toISOString(),
    };
  }
}
