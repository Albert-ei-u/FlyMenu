import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateMenuCategoryDto {
  @ApiPropertyOptional({ example: 'cuid1234restaurant', description: 'Associated restaurant ID.' })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiProperty({ example: 'Starters', description: 'Name of the menu category (e.g. Starters, Main Course, Drinks).' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'starters', description: 'Optional unique URL-friendly slug.' })
  @IsOptional()
  @IsString()
  slug?: string;
}

