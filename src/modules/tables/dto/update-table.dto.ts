import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTableDto {
  @ApiPropertyOptional({ example: 'T-12', description: 'Unique code identifying the table.' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ example: 'BOOTH', description: 'Table seating type.' })
  @IsOptional()
  @IsString()
  tableType?: string;

  @ApiPropertyOptional({ example: 4, description: 'Seating capacity.' })
  @IsOptional()
  @IsNumber()
  capacity?: number;

  @ApiPropertyOptional({ example: 'Near window.', description: 'Optional configuration notes.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: true, description: 'Mark whether table is active.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

