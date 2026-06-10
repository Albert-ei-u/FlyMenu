import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { toCsv } from '../../common/csv';
import { moduleStatus } from '../../common/module-status';
import { createOrderNumber } from '../../common/order-number';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { CurrentUser } from '../../common/auth/current-user';
import { getRestaurantIdForUser } from '../../common/auth/restaurant-id';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  status() {
    return moduleStatus('orders', 'Order creation, kitchen board statuses, tracking events, and live updates.');
  }

  async findAll(user?: CurrentUser) {
    let where: any = {};

    if (user) {
      if (user.role === 'RESTAURANT_OWNER') {
        const restaurantId = await getRestaurantIdForUser(this.prisma, user);
        if (restaurantId) {
          where.restaurantId = restaurantId;
        }
      } else if (user.role === 'CUSTOMER') {
        where.customerId = user.sub;
      }
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true } },
        items: true,
      },
    });
  }

  async exportCsv(user?: CurrentUser) {
    let where: any = {};

    if (user) {
      if (user.role === 'RESTAURANT_OWNER') {
        const restaurantId = await getRestaurantIdForUser(this.prisma, user);
        if (restaurantId) {
          where.restaurantId = restaurantId;
        }
      } else if (user.role === 'CUSTOMER') {
        where.customerId = user.sub;
      }
    }

    const orders = await this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { restaurant: { select: { name: true } } },
    });

    return toCsv(
      orders.map((order) => ({
        orderNumber: order.orderNumber,
        restaurant: order.restaurant.name,
        customerName: order.customerName,
        status: order.status,
        total: order.total,
        createdAt: order.createdAt.toISOString(),
      })),
    );
  }

  async create(body: CreateOrderDto, user?: CurrentUser) {
    const subtotal = body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    const order = await this.prisma.order.create({
      data: {
        orderNumber: createOrderNumber(),
        restaurantId: body.restaurantId,
        customerId: user?.sub,
        customerName: body.customerName,
        customerPhone: body.customerPhone,
        subtotal,
        total: body.total,
        items: {
          create: body.items.map((item) => ({
            menuItemId: item.menuItemId,
            name: item.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            notes: item.notes,
          })),
        },
        trackingEvents: {
          create: {
            status: 'PENDING',
            title: 'Order received',
            message: 'The order has been received and is waiting for confirmation.',
          },
        },
      },
      include: { items: true, trackingEvents: true },
    });

    this.realtime.emitOrderUpdate({ id: order.id, status: order.status, order });
    
    this.realtime.emitNotification({
      type: 'ORDER',
      title: 'New Order Received',
      message: `Order #${order.orderNumber} for $${order.total} from ${order.customerName}.`,
      restaurantId: order.restaurantId,
    });

    return order;
  }

  findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        trackingEvents: { orderBy: { createdAt: 'asc' } },
        restaurant: true,
      },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        trackingEvents: {
          create: {
            status: status as OrderStatus,
            title: `Order ${status.toLowerCase().replace('_', ' ')}`,
          },
        },
      },
      include: { items: true, trackingEvents: true },
    });

    // If order is completed and has a customer, update their customer restaurant stats
    if (status === 'COMPLETED' && order.customerId) {
      // Ensure the user has a customer profile
      await this.prisma.customerProfile.upsert({
        where: { userId: order.customerId },
        create: { userId: order.customerId },
        update: {},
      });

      // Upsert the customer restaurant record
      await this.prisma.customerRestaurant.upsert({
        where: {
          customerProfileId_restaurantId: {
            customerProfileId: (await this.prisma.customerProfile.findUniqueOrThrow({ where: { userId: order.customerId } })).id,
            restaurantId: order.restaurantId,
          },
        },
        create: {
          customerProfileId: (await this.prisma.customerProfile.findUniqueOrThrow({ where: { userId: order.customerId } })).id,
          restaurantId: order.restaurantId,
          totalOrders: 1,
          totalSpend: order.total,
          lastVisitAt: new Date(),
        },
        update: {
          totalOrders: { increment: 1 },
          totalSpend: { increment: order.total },
          lastVisitAt: new Date(),
        },
      });
    }

    const payload = { id, status, order };
    this.realtime.emitOrderUpdate(payload);
    return order;
  }
}
