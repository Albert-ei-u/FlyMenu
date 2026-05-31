import { Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class SearchRestaurantsDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  cuisine?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  openNow?: boolean;
}
