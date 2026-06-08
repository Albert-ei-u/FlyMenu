import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from './dto/create-client.dto';
import { ClientsService } from './clients.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../../common/auth/current-user';

@ApiTags('Clients')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('clients')
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Get()
  @ApiOperation({ summary: 'List all clients', description: 'Retrieve all restaurant clients with loyalty tiers and spend stats.' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.clientsService.findAll(user);
  }

  @Post()
  @ApiOperation({ summary: 'Create client', description: 'Add a new client profile under a restaurant CRM.' })
  create(@Body() body: CreateClientDto) {
    return this.clientsService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get client by ID', description: 'Fetch details of a specific client.' })
  @ApiParam({ name: 'id', description: 'Client ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.clientsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update client', description: 'Update loyalty tier, contact details, or CRM comments for a client.' })
  @ApiParam({ name: 'id', description: 'Client ID (CUID).' })
  update(@Param('id') id: string, @Body() body: Partial<CreateClientDto>) {
    return this.clientsService.update(id, body);
  }
}

