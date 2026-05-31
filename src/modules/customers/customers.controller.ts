import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';

@ApiTags('Customers')
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
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

