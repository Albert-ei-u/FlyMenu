import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { ReservationsService } from './reservations.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../../common/auth/current-user';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'Module status' })
  status() {
    return this.reservationsService.status();
  }

  @Get('list')
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'List reservations', description: 'Retrieve all reservations, filtered by restaurant for owners, or all for super-admins.' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.reservationsService.findAll(user);
  }

  @Get('availability')
  @ApiOperation({ summary: 'Check availability', description: 'Query available time slots and tables for a restaurant on a specific date and party size.' })
  availability(@Query() query: CheckAvailabilityDto) {
    return this.reservationsService.availability(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create booking', description: 'Create a new table reservation. Returns confirmation number and booking details.' })
  create(@Body() body: CreateReservationDto) {
    return this.reservationsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation', description: 'Fetch full reservation details including restaurant and table info.' })
  @ApiParam({ name: 'id', description: 'Reservation ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(id);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel reservation', description: 'Cancel a pending or confirmed reservation.' })
  @ApiParam({ name: 'id', description: 'Reservation ID (CUID).' })
  cancel(@Param('id') id: string) {
    return this.reservationsService.cancel(id);
  }
}

