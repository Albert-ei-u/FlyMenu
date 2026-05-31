import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TablesService } from './tables.service';

@ApiTags('Tables')
@Controller('tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @ApiOperation({ summary: 'List tables', description: 'Retrieve all tables, optionally filtered by restaurant.' })
  @ApiQuery({ name: 'restaurantId', required: false, description: 'Optional restaurant ID filter.' })
  findAll(@Query('restaurantId') restaurantId?: string) {
    return this.tablesService.findAll(restaurantId);
  }

  @Post()
  @ApiOperation({ summary: 'Create table', description: 'Create a new dining table with unique code, capacity, and seating type.' })
  create(@Body() body: CreateTableDto) {
    return this.tablesService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get table details', description: 'Fetch configuration and current status of a specific table.' })
  @ApiParam({ name: 'id', description: 'Table ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.tablesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update table details', description: 'Modify table code, seating capacity, or configuration note.' })
  @ApiParam({ name: 'id', description: 'Table ID (CUID).' })
  update(@Param('id') id: string, @Body() body: UpdateTableDto) {
    return this.tablesService.update(id, body);
  }

  @Patch(':id/deactivate')
  @ApiOperation({ summary: 'Deactivate table', description: 'Mark a dining table as inactive (will not be open for reservations).' })
  @ApiParam({ name: 'id', description: 'Table ID (CUID).' })
  deactivate(@Param('id') id: string) {
    return this.tablesService.deactivate(id);
  }
}

