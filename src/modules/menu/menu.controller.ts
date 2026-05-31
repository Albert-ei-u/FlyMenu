import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateMenuCategoryDto } from './dto/create-menu-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  status() {
    return this.menuService.status();
  }

  @Post('categories')
  createCategory(@Body() body: CreateMenuCategoryDto) {
    return this.menuService.createCategory(body);
  }

  @Get('categories')
  listCategories() {
    return this.menuService.listCategories();
  }

  @Post('items')
  createItem(@Body() body: CreateMenuItemDto) {
    return this.menuService.createItem(body);
  }

  @Get('items')
  listItems() {
    return this.menuService.listItems();
  }

  @Patch('items/:id')
  updateItem(@Param('id') id: string, @Body() body: Partial<CreateMenuItemDto>) {
    return this.menuService.updateItem(id, body);
  }
}
