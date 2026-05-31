import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { FavoritesService } from './favorites.service';

@ApiTags('Favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List favorites', description: 'Retrieve all favorited restaurants for a specific customer.' })
  @ApiQuery({ name: 'userId', required: true, description: 'ID of the user.' })
  findAll(@Query('userId') userId: string) {
    return this.favoritesService.findAll(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add favorite', description: 'Add a restaurant to a user\'s favorites list.' })
  create(@Body() body: CreateFavoriteDto) {
    return this.favoritesService.create(body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove favorite', description: 'Remove a restaurant from a user\'s favorites list by record ID.' })
  @ApiParam({ name: 'id', description: 'Favorite record ID (CUID).' })
  remove(@Param('id') id: string) {
    return this.favoritesService.remove(id);
  }
}

