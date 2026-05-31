import { Injectable } from '@nestjs/common';
import { ReviewTag } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(filters: { restaurantId?: string; orderId?: string }) {
    return this.prisma.review.findMany({
      where: {
        restaurantId: filters.restaurantId,
        orderId: filters.orderId,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        restaurant: { select: { id: true, name: true } },
        customer: { select: { id: true, fullName: true, avatarUrl: true } },
      },
    });
  }

  async create(body: CreateReviewDto) {
    const review = await this.prisma.review.create({
      data: {
        restaurantId: body.restaurantId,
        orderId: body.orderId,
        customerId: body.customerId,
        rating: body.rating,
        tags: (body.tags ?? []) as ReviewTag[],
        comment: body.comment,
      },
    });

    const aggregate = await this.prisma.review.aggregate({
      where: { restaurantId: body.restaurantId },
      _avg: { rating: true },
      _count: { id: true },
    });

    await this.prisma.restaurant.update({
      where: { id: body.restaurantId },
      data: {
        ratingAverage: aggregate._avg.rating ?? 0,
        ratingCount: aggregate._count.id,
      },
    });

    return review;
  }
}
