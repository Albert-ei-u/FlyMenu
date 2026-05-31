import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'List reviews', description: 'Retrieve reviews, filtered by restaurant or order.' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Optional restaurant ID filter.' })
  @ApiQuery({ name: 'orderId', required: false, description: 'Optional order ID filter.' })
  findAll(@Query('restaurantId') restaurantId?: string, @Query('orderId') orderId?: string) {
    return this.reviewsService.findAll({ restaurantId, orderId });
  }

  @Post()
  @ApiOperation({ summary: 'Submit review', description: 'Submit ratings & comments. Updates restaurant aggregate rating stats.' })
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }
}

