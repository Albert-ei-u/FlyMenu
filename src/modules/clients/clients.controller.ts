import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  findAll() {
    return this.clientsService.findAll();
  }

  @Post()
  create(@Body() body: CreateClientDto) {
    return this.clientsService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateClientDto>) {
    return this.clientsService.update(id, body);
  }
}
