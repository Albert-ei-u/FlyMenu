import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { SearchRestaurantsDto } from './dto/search-restaurants.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../../common/auth/current-user';

@ApiTags('Restaurants')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @ApiOperation({ summary: 'Search restaurants', description: 'Search and filter active restaurants by cuisine, city, price range, or keyword.' })
  @ApiQuery({ name: 'q', required: false, description: 'Full-text search across name, cuisine, description, and menu items.' })
  @ApiQuery({ name: 'cuisine', required: false, description: 'Filter by cuisine type.' })
  @ApiQuery({ name: 'city', required: false, description: 'Filter by city.' })
  @ApiQuery({ name: 'priceRange', required: false, description: 'Filter by price range (e.g. "$$$ Expensive").' })
  findAll(@Query() query: SearchRestaurantsDto) {
    return this.restaurantsService.findAll(query);
  }

  @Get('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user restaurant profile', description: 'Fetch the restaurant profile for the authenticated user.' })
  getProfile(@CurrentUser() user: CurrentUserType) {
    return this.restaurantsService.findForUser(user);
  }

  @Patch('profile')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update restaurant profile' })
  updateProfile(@CurrentUser() user: CurrentUserType, @Body() body: UpdateRestaurantDto) {
    return this.restaurantsService.updateProfile(user, body);
  }

  @Post('request-approval')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Request restaurant approval' })
  requestApproval(@CurrentUser() user: CurrentUserType) {
    return this.restaurantsService.requestApproval(user);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Featured restaurants', description: 'Returns top-rated active restaurants (ordered by rating).' })
  featured() {
    return this.restaurantsService.featured();
  }

  @Get('trending')
  @ApiOperation({ summary: 'Trending restaurants', description: 'Returns the most ordered-from restaurants.' })
  trending() {
    return this.restaurantsService.trending();
  }

  @Get('categories')
  @ApiOperation({ summary: 'All menu categories', description: 'Returns unique category names used across all restaurant menus.' })
  categories() {
    return this.restaurantsService.categories();
  }

  @Post()
  @ApiOperation({ summary: 'Create restaurant', description: 'Create a new restaurant profile. Automatically generates a unique slug and default settings.' })
  create(@Body() body: CreateRestaurantDto) {
    return this.restaurantsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant', description: 'Fetch a full restaurant profile including menu categories, items, tables, and settings.' })
  @ApiParam({ name: 'id', description: 'Restaurant ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update restaurant', description: 'Update restaurant operating details such as cuisine, contact info, services, and location.' })
  @ApiParam({ name: 'id', description: 'Restaurant ID (CUID).' })
  update(@Param('id') id: string, @Body() body: Partial<CreateRestaurantDto>) {
    return this.restaurantsService.update(id, body);
  }
}

