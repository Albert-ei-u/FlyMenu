import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateStaffMemberDto {
  @IsString()
  restaurantId!: string;

  @IsString()
  fullName!: string;

  @IsString()
  role!: string;

  @IsString()
  employeeCode!: string;

  @IsOptional()
  @IsNumber()
  efficiency?: number;
}
