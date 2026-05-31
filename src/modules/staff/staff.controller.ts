import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateStaffMemberDto } from './dto/create-staff-member.dto';
import { StaffService } from './staff.service';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Get()
  findAll() {
    return this.staffService.findAll();
  }

  @Post()
  create(@Body() body: CreateStaffMemberDto) {
    return this.staffService.create(body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.staffService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: Partial<CreateStaffMemberDto>) {
    return this.staffService.update(id, body);
  }
}
