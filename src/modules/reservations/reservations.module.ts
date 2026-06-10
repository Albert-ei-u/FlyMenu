import { Module } from '@nestjs/common';
import { RealtimeModule } from '../../realtime/realtime.module';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

@Module({
  imports: [RealtimeModule],
  controllers: [ReservationsController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
