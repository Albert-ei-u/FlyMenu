import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(userId: string) {
    return this.prisma.favoriteRestaurant.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: {
          include: {
            media: true,
            categories: true,
          },
        },
      },
    });
  }

  create(body: CreateFavoriteDto) {
    return this.prisma.favoriteRestaurant.upsert({
      where: {
        userId_restaurantId: {
          userId: body.userId,
          restaurantId: body.restaurantId,
        },
      },
      update: {},
      create: body,
      include: { restaurant: true },
    });
  }

  remove(id: string) {
    return this.prisma.favoriteRestaurant.delete({ where: { id } });
  }
}
