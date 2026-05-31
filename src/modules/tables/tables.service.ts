import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(restaurantId?: string) {
    return this.prisma.restaurantTable.findMany({
      where: restaurantId ? { restaurantId } : undefined,
      orderBy: [{ code: 'asc' }],
      include: {
        restaurant: {
          select: { id: true, name: true },
        },
      },
    });
  }

  create(body: CreateTableDto) {
    return this.prisma.restaurantTable.create({
      data: {
        restaurantId: body.restaurantId,
        code: body.code,
        tableType: body.tableType,
        capacity: body.capacity,
        notes: body.notes,
        isActive: body.isActive ?? true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.restaurantTable.findUnique({
      where: { id },
      include: {
        restaurant: {
          select: { id: true, name: true },
        },
        reservations: {
          orderBy: { reservationDate: 'desc' },
          take: 20,
        },
      },
    });
  }

  update(id: string, body: UpdateTableDto) {
    return this.prisma.restaurantTable.update({
      where: { id },
      data: body,
    });
  }

  deactivate(id: string) {
    return this.prisma.restaurantTable.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
