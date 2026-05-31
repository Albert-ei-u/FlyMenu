import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { OperationsService } from './operations.service';

@Controller('operations')
export class OperationsController {
  constructor(private readonly operationsService: OperationsService) {}

  @Get()
  dashboard() {
    return this.operationsService.dashboard();
  }

  @Post('incidents')
  createIncident(@Body() body: CreateIncidentDto) {
    return this.operationsService.createIncident(body);
  }

  @Patch('incidents/:id/resolve')
  resolveIncident(@Param('id') id: string) {
    return this.operationsService.resolveIncident(id);
  }
}
