import { Injectable } from '@nestjs/common';
import { IncidentSeverity } from '@prisma/client';
import { moduleStatus } from '../../common/module-status';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';

@Injectable()
export class OperationsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('operations', 'Kitchen throughput, active tickets, incidents, service power, and activity logs.');
  }

  async dashboard() {
    const [openIncidents, activeOrders] = await Promise.all([
      this.prisma.operationalIncident.findMany({
        where: { status: { in: ['OPEN', 'IN_PROGRESS'] } },
        orderBy: { createdAt: 'desc' },
        include: { restaurant: true },
      }),
      this.prisma.order.count({ where: { status: { in: ['PENDING', 'CONFIRMED', 'PREPARING'] } } }),
    ]);

    return {
      servicePower: 'LIVE',
      activeTickets: activeOrders,
      incidents: openIncidents,
    };
  }

  createIncident(body: CreateIncidentDto) {
    return this.prisma.operationalIncident.create({
      data: {
        restaurantId: body.restaurantId,
        title: body.title,
        resource: body.resource,
        severity: body.severity as IncidentSeverity,
        timeline: body.timeline,
      },
    });
  }

  resolveIncident(id: string) {
    return this.prisma.operationalIncident.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    });
  }
}
