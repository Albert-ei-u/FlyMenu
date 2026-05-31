import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTableDto {
  @ApiProperty({ example: 'cuid1234restaurant', description: 'Associated restaurant ID.' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ example: 'T-12', description: 'Unique code identifying the table (e.g. T-12, Booth 4).' })
  @IsString()
  code!: string;

  @ApiProperty({ example: 'BOOTH', description: 'Table type description (e.g. BOOTH, INDOOR, OUTDOOR, BAR).' })
  @IsString()
  tableType!: string;

  @ApiProperty({ example: 4, description: 'Seating capacity of the table.' })
  @IsNumber()
  capacity!: number;

  @ApiPropertyOptional({ example: 'Near fireplace.', description: 'Optional operational notes on the table location.' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ example: true, description: 'Mark whether the table is active and open for seating.' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

