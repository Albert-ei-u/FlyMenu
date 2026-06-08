import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { CurrentUser } from '../../common/auth/current-user';
import { getRestaurantIdForUser } from '../../common/auth/restaurant-id';

@Injectable()
export class TablesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(user?: CurrentUser, restaurantId?: string) {
    const effectiveRestaurantId = restaurantId ?? (user ? await getRestaurantIdForUser(this.prisma, user) : undefined);
    const where = effectiveRestaurantId ? { restaurantId: effectiveRestaurantId } : {};

    return this.prisma.restaurantTable.findMany({
      where,
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
