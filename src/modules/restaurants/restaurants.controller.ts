import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SearchRestaurantsDto } from './dto/search-restaurants.dto';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  findAll(@Query() query: SearchRestaurantsDto) {
    return this.restaurantsService.findAll(query);
  }

  @Get('featured')
  featured() {
    return this.restaurantsService.featured();
  }

  @Get('trending')
  trending() {
    return this.restaurantsService.trending();
  }

  @Get('categories')
  categories() {
    return this.restaurantsService.categories();
  }

  @Post()
  create(@Body() body: CreateRestaurantDto) {
    return this.restaurantsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateRestaurantDto>) {
    return this.restaurantsService.update(id, body);
  }
}
