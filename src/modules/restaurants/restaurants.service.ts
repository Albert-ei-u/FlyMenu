import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { toSlug } from '../../common/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SearchRestaurantsDto } from './dto/search-restaurants.dto';

@Injectable()
export class RestaurantsService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('restaurants', 'Restaurant discovery profiles, operating details, services, capacity, and status.');
  }

  findAll(query: SearchRestaurantsDto = {}) {
    const search = query.q?.trim();

    return this.prisma.restaurant.findMany({
      where: {
        status: 'ACTIVE',
        cuisine: query.cuisine ? { contains: query.cuisine, mode: 'insensitive' } : undefined,
        city: query.city ? { contains: query.city, mode: 'insensitive' } : undefined,
        priceRange: query.priceRange,
        ratingAverage: query.minRating ? { gte: query.minRating } : undefined,
        OR: search
          ? [
              { name: { contains: search, mode: 'insensitive' } },
              { cuisine: { contains: search, mode: 'insensitive' } },
              { description: { contains: search, mode: 'insensitive' } },
              { menuItems: { some: { name: { contains: search, mode: 'insensitive' } } } },
            ]
          : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        owner: { select: { id: true, fullName: true, email: true } },
        media: true,
        categories: true,
      },
    });
  }

  featured() {
    return this.prisma.restaurant.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ ratingAverage: 'desc' }, { ratingCount: 'desc' }],
      take: 6,
      include: { media: true, categories: true },
    });
  }

  trending() {
    return this.prisma.restaurant.findMany({
      where: { status: 'ACTIVE' },
      orderBy: [{ ratingCount: 'desc' }, { createdAt: 'desc' }],
      take: 6,
      include: { media: true, categories: true },
    });
  }

  async categories() {
    const categories = await this.prisma.menuCategory.findMany({
      distinct: ['name'],
      orderBy: { name: 'asc' },
      select: { name: true, slug: true },
    });

    return categories;
  }

  findOne(id: string) {
    return this.prisma.restaurant.findUnique({
      where: { id },
      include: {
        owner: { select: { id: true, fullName: true, email: true } },
        media: true,
        categories: { include: { items: true } },
        tables: true,
        settings: true,
      },
    });
  }

  async create(body: CreateRestaurantDto) {
    const baseSlug = toSlug(body.name);
    const slug = `${baseSlug}-${Date.now().toString(36)}`;

    return this.prisma.restaurant.create({
      data: {
        ownerId: body.ownerId,
        name: body.name,
        slug,
        cuisine: body.cuisine,
        description: body.description,
        priceRange: body.priceRange,
        email: body.email,
        phone: body.phone,
        city: body.city,
        country: body.country,
        services: body.services ?? [],
        settings: {
          create: {},
        },
      },
    });
  }

  update(id: string, body: Partial<CreateRestaurantDto>) {
    return this.prisma.restaurant.update({
      where: { id },
      data: {
        name: body.name,
        cuisine: body.cuisine,
        description: body.description,
        priceRange: body.priceRange,
        email: body.email,
        phone: body.phone,
        city: body.city,
        country: body.country,
        services: body.services,
      },
    });
  }
}
