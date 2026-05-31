import { Injectable } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { toCsv } from '../../common/csv';
import { moduleStatus } from '../../common/module-status';
import { createOrderNumber } from '../../common/order-number';
import { PrismaService } from '../../prisma/prisma.service';
import { RealtimeGateway } from '../../realtime/realtime.gateway';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtime: RealtimeGateway,
  ) {}

  status() {
    return moduleStatus('orders', 'Order creation, kitchen board statuses, tracking events, and live updates.');
  }

  findAll() {
    return this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true } },
        items: true,
      },
    });
  }

  async exportCsv() {
    const orders = await this.prisma.order.findMany({
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

  create(body: CreateOrderDto) {
    const subtotal = body.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return this.prisma.order.create({
      data: {
        orderNumber: createOrderNumber(),
        restaurantId: body.restaurantId,
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

    const payload = { id, status, order };
    this.realtime.emitOrderUpdate(payload);
    return order;
  }
}
