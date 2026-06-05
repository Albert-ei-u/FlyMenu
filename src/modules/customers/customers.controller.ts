import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { RolesGuard } from '../../common/auth/roles.guard';
import { Roles } from '../../common/auth/roles.decorator';

@ApiTags('Customers')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard, RolesGuard)
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'List all customers', description: 'Retrieve all customer platform profiles.' })
  findAll() {

    return this.customersService.findAll();
  }

  

  @Get(':id')
  @ApiOperation({ summary: 'Get customer profile', description: 'Fetch personal details, contact info, and profile info for a customer.' })
  @ApiParam({ name: 'id', description: 'Customer ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/orders')
  @ApiOperation({ summary: 'Get customer orders', description: 'Fetch all orders placed by this customer.' })
  @ApiParam({ name: 'id', description: 'Customer ID (CUID).' })
  orders(@Param('id') id: string) {
    return this.customersService.orders(id);
  }

  @Get(':id/reservations')
  @ApiOperation({ summary: 'Get customer reservations', description: 'Fetch all reservations booked by this customer.' })
  @ApiParam({ name: 'id', description: 'Customer ID (CUID).' })
  reservations(@Param('id') id: string) {
    return this.customersService.reservations(id);
  }

  @Get(':id/favorites')
  @ApiOperation({ summary: 'Get customer favorites', description: 'Fetch all favorited restaurants for this customer.' })
  @ApiParam({ name: 'id', description: 'Customer ID (CUID).' })
  favorites(@Param('id') id: string) {
    return this.customersService.favorites(id);
  }
}

