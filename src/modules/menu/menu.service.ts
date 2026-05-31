import { Injectable } from '@nestjs/common';
import { moduleStatus } from '../../common/module-status';
import { toSlug } from '../../common/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  status() {
    return moduleStatus('menu', 'Categories, menu items, availability, images, nutrition, allergens, and publication settings.');
  }

  createCategory(body: CreateMenuCategoryDto) {
    return this.prisma.menuCategory.create({
      data: {
        restaurantId: body.restaurantId,
        name: body.name,
        slug: body.slug ?? toSlug(body.name),
      },
    });
  }

  listCategories() {
    return this.prisma.menuCategory.findMany({
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      include: { items: true },
    });
  }

  createItem(body: CreateMenuItemDto) {
    return this.prisma.menuItem.create({
      data: {
        restaurantId: body.restaurantId,
        categoryId: body.categoryId,
        name: body.name,
        description: body.description,
        price: body.price,
        isLive: body.isLive ?? false,
        isHighlighted: body.isHighlighted ?? false,
        status: body.isLive ? 'AVAILABLE' : 'DRAFT',
        tags: body.tags ?? [],
        allergens: body.allergens ?? [],
      },
      include: { category: true, media: true },
    });
  }

  listItems() {
    return this.prisma.menuItem.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, media: true },
    });
  }

  updateItem(id: string, body: Partial<CreateMenuItemDto>) {
    return this.prisma.menuItem.update({
      where: { id },
      data: {
        categoryId: body.categoryId,
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
