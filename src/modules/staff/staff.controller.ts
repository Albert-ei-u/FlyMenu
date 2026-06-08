import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { StaffService } from './staff.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../../common/auth/current-user';

@ApiTags('Staff')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  @ApiOperation({ summary: 'List staff', description: 'List all staff members across all restaurants.' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.staffService.findAll(user);
  }

  @Post()
  @ApiOperation({ summary: 'Add staff member', description: 'Onboard a new employee with role, employee code, and initial efficiency rating.' })
  create(@Body() body: CreateStaffMemberDto) {
    return this.staffService.create(body);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get staff member', description: 'Fetch a staff member profile by ID.' })
  @ApiParam({ name: 'id', description: 'Staff member ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update staff member', description: 'Update role, status, efficiency, or hours worked for a staff member.' })
  @ApiParam({ name: 'id', description: 'Staff member ID (CUID).' })
  update(@Param('id') id: string, @Body() body: Partial<CreateStaffMemberDto>) {
    return this.staffService.update(id, body);
  }
}

