import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  ownerId!: string;

  @IsString()
  name!: string;

  @IsString()
  cuisine!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  priceRange?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsArray()
  services?: string[];
}
