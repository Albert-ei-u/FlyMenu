import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users', description: 'Retrieve all platform users including roles and status.' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details', description: 'Fetch basic profile details for a user.' })
  @ApiParam({ name: 'id', description: 'User ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
}

