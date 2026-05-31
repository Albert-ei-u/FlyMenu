import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoritesService } from './favorites.service';

@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.favoritesService.findAll(userId);
  }

  @Post()
  create(@Body() body: CreateFavoriteDto) {
    return this.favoritesService.create(body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}
