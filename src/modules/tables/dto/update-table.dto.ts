import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTableDto {
  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  tableType?: string;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
