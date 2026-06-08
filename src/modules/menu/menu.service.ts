import { BadRequestException, Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { toSlug } from '../../common/slug';
import { CurrentUser } from '../../common/auth/current-user';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { getRestaurantIdForUser } from '../../common/auth/restaurant-id';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('menu', 'Categories, menu items, availability, images, nutrition, allergens, and publication settings.');
  }

  async createCategory(body: CreateMenuCategoryDto, user: CurrentUser) {
    const restaurantId = body.restaurantId ?? (await getRestaurantIdForUser(this.prisma, user));
    if (!restaurantId) throw new BadRequestException('Restaurant ID is required.');

    const slug = body.slug ?? toSlug(body.name);

    // Check if a category with the same slug already exists for this restaurant
    const existing = await this.prisma.menuCategory.findUnique({
      where: {
        restaurantId_slug: {
          restaurantId,
          slug,
        },
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.menuCategory.create({
      data: {
        restaurantId,
        name: body.name,
        slug,
      },
    });
  }

  async listCategories(user: CurrentUser) {
    const restaurantId = await getRestaurantIdForUser(this.prisma, user);
    const where = restaurantId ? { restaurantId } : {};

    return this.prisma.menuCategory.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { items: true },
    });
  }

  async createItem(body: CreateMenuItemDto, user: CurrentUser) {
    const restaurantId = body.restaurantId ?? (await getRestaurantIdForUser(this.prisma, user));
    if (!restaurantId) throw new BadRequestException('Restaurant ID is required.');

    // Ensure categoryId is valid CUID or null
    const categoryId = body.categoryId && body.categoryId.trim() !== '' ? body.categoryId : null;

    return this.prisma.menuItem.create({
      data: {
        restaurantId,
        categoryId,
        name: body.name,
        description: body.description,
        price: body.price,
        isLive: body.isLive ?? false,
        isHighlighted: body.isHighlighted ?? false,
        status: body.status ?? (body.isLive ? 'AVAILABLE' : 'DRAFT'),
        tags: body.tags ?? [],
        allergens: body.allergens ?? [],
      },
      include: { category: true, media: true },
    });
  }

  async listItems(user: CurrentUser) {
    const restaurantId = await getRestaurantIdForUser(this.prisma, user);
    const where = restaurantId ? { restaurantId } : {};

    return this.prisma.menuItem.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true, media: true },
    });
  }

  updateItem(id: string, body: Partial<CreateMenuItemDto>) {
    const categoryId = body.categoryId === "" ? null : body.categoryId;
    
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        categoryId,
        name: body.name,
        description: body.description,
        price: body.price,
        isLive: body.isLive,
        isHighlighted: body.isHighlighted,
        status: body.isLive === undefined ? undefined : body.isLive ? 'AVAILABLE' : 'UNAVAILABLE',
        tags: body.tags,
        allergens: body.allergens,
      },
      include: { category: true, media: true },
    });
  }
}
