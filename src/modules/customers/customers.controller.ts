import { Controller, Get, Param } from '@nestjs/common';
import { CustomersService } from './customers.service';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Get()
  findAll() {
    return this.customersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.customersService.findOne(id);
  }

  @Get(':id/orders')
  orders(@Param('id') id: string) {
    return this.customersService.orders(id);
  }

  @Get(':id/reservations')
  reservations(@Param('id') id: string) {
    return this.customersService.reservations(id);
  }

  @Get(':id/favorites')
  favorites(@Param('id') id: string) {
    return this.customersService.favorites(id);
  }
}
