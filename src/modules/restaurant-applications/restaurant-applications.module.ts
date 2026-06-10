import { Module } from '@nestjs/common';
import { RealtimeModule } from '../../realtime/realtime.module';
import { RestaurantApplicationsController } from './restaurant-applications.controller';
import { RestaurantApplicationsService } from './restaurant-applications.service';

@Module({
  imports: [RealtimeModule],
  controllers: [RestaurantApplicationsController],
  providers: [RestaurantApplicationsService],
})
export class RestaurantApplicationsModule {}
