import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  @ApiOperation({ summary: 'Module status' })
  status() {
    return this.menuService.status();
  }

  @Post('categories')
  @ApiOperation({ summary: 'Create category', description: 'Create a menu category for a restaurant (e.g. Starters, Mains, Desserts).' })
  createCategory(@Body() body: CreateMenuCategoryDto) {
    return this.menuService.createCategory(body);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List categories', description: 'List all menu categories with their associated items.' })
  listCategories() {
    return this.menuService.listCategories();
  }

  @Post('items')
  @ApiOperation({ summary: 'Create menu item', description: 'Add a new menu item with price, nutrition, allergens, tags, and availability settings.' })
  createItem(@Body() body: CreateMenuItemDto) {
    return this.menuService.createItem(body);
  }

  @Get('items')
  @ApiOperation({ summary: 'List menu items', description: 'List all menu items across all restaurants.' })
  listItems() {
    return this.menuService.listItems();
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update menu item', description: 'Update a menu item\'s details, category, price, status, or availability.' })
  @ApiParam({ name: 'id', description: 'Menu item ID (CUID).' })
  updateItem(@Param('id') id: string, @Body() body: Partial<CreateMenuItemDto>) {
    return this.menuService.updateItem(id, body);
  }
}

