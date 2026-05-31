import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTableDto {
  @IsString()
  restaurantId!: string;

  @IsString()
  code!: string;

  @IsString()
  tableType!: string;

  @IsNumber()
  capacity!: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
