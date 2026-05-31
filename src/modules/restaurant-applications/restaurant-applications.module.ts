import { Module } from '@nestjs/common';
import { RestaurantApplicationsController } from './restaurant-applications.controller';
import { RestaurantApplicationsService } from './restaurant-applications.service';

@Module({
  controllers: [RestaurantApplicationsController],
  providers: [RestaurantApplicationsService],
})
export class RestaurantApplicationsModule {}
