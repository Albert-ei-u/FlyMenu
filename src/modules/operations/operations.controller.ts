import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { OperationsService } from './operations.service';

@ApiTags('Operations')
@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  @ApiOperation({ summary: 'Operations dashboard', description: 'Fetch restaurant operations dashboard containing ticketing load, kitchen queues, and incident lists.' })
  dashboard() {
    return this.operationsService.dashboard();
  }

  @Post('incidents')
  @ApiOperation({ summary: 'Create incident', description: 'Log a new operational incident (e.g. tablet offline, POS failure, staff shortage).' })
  createIncident(@Body() body: CreateIncidentDto) {
    return this.operationsService.createIncident(body);
  }

  @Patch('incidents/:id/resolve')
  @ApiOperation({ summary: 'Resolve incident', description: 'Mark a logged operational incident as resolved.' })
  @ApiParam({ name: 'id', description: 'Incident ID (CUID).' })
  resolveIncident(@Param('id') id: string) {
    return this.operationsService.resolveIncident(id);
  }
}

