import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../../common/auth/current-user';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuService } from './menu.service';

@ApiTags('Menu')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
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
  createCategory(@Body() body: CreateMenuCategoryDto, @CurrentUser() user: CurrentUserType) {
    return this.menuService.createCategory(body, user);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List categories', description: 'List all menu categories with their associated items.' })
  listCategories(@CurrentUser() user: CurrentUserType) {
    return this.menuService.listCategories(user);
  }

  @Post('items')
  @ApiOperation({ summary: 'Create menu item', description: 'Add a new menu item with price, nutrition, allergens, tags, and availability settings.' })
  createItem(@Body() body: CreateMenuItemDto, @CurrentUser() user: CurrentUserType) {
    return this.menuService.createItem(body, user);
  }

  @Get('items')
  @ApiOperation({ summary: 'List menu items', description: 'List all menu items for the current restaurant.' })
  listItems(@CurrentUser() user: CurrentUserType) {
    return this.menuService.listItems(user);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update menu item', description: 'Update a menu item\'s details, category, price, status, or availability.' })
  @ApiParam({ name: 'id', description: 'Menu item ID (CUID).' })
  updateItem(@Param('id') id: string, @Body() body: Partial<CreateMenuItemDto>) {
    return this.menuService.updateItem(id, body);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete menu item', description: 'Permanently remove a menu item and its associated media.' })
  @ApiParam({ name: 'id', description: 'Menu item ID (CUID).' })
  deleteItem(@Param('id') id: string) {
    return this.menuService.deleteItem(id);
  }
}

