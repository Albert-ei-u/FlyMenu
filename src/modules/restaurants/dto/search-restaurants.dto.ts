import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchRestaurantsDto {
  @ApiPropertyOptional({ example: 'Grill', description: 'Keyword search query.' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ example: 'Steakhouse', description: 'Filter by cuisine type.' })
  @IsOptional()
  @IsString()
  cuisine?: string;

  @ApiPropertyOptional({ example: 'London', description: 'Filter by city.' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: '$$$ Moderate', description: 'Filter by price range.' })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({ example: 4, description: 'Filter by minimum aggregate rating.' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @ApiPropertyOptional({ example: true, description: 'Filter only restaurants currently open.' })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  openNow?: boolean;
}

