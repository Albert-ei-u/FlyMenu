import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';

@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.tablesService.findAll(restaurantId);
  }

  @Post()
  create(@Body() body: CreateTableDto) {
    return this.tablesService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: UpdateTableDto) {
    return this.tablesService.update(id, body);
  }

  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.tablesService.deactivate(id);
  }
}
