import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStaffMemberDto {
  @ApiProperty({ example: 'cuid1234restaurant', description: 'Associated restaurant ID.' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ example: 'Jane Smith', description: 'Full name of the staff member.' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'CHEF', description: 'Staff role (e.g. MANAGER, CHEF, WAITER, CLEANER).' })
  @IsString()
  role!: string;

  @ApiProperty({ example: 'EMP-051', description: 'Unique internal employee code.' })
  @IsString()
  employeeCode!: string;

  @ApiPropertyOptional({ example: 85, description: 'Optional operational efficiency tracking score (out of 100).' })
  @IsOptional()
  @IsNumber()
  efficiency?: number;
}

