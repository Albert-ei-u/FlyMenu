import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { Query } from '@nestjs/common';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  status() {
    return this.reservationsService.status();
  }

  @Get('availability')
  availability(@Query() query: CheckAvailabilityDto) {
    return this.reservationsService.availability(query);
  }

  @Post()
  create(@Body() body: CreateReservationDto) {
    return this.reservationsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id/cancel')
  cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(id);
  }
}
