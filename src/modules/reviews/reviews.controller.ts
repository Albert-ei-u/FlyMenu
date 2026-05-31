import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(@Query('restaurantId') restaurantId?: string, @Query('orderId') orderId?: string) {
    return this.reviewsService.findAll({ restaurantId, orderId });
  }

  @Post()
  create(@Body() body: CreateReviewDto) {
    return this.reviewsService.create(body);
  }
}
