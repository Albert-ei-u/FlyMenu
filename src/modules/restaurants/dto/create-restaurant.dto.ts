import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'cuid1234owner', description: 'ID of the user who owns this restaurant profile.' })
  @IsString()
  ownerId!: string;

  @ApiProperty({ example: 'Obsidian Grill', description: 'Name of the restaurant.' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 'Steakhouse', description: 'Primary cuisine type.' })
  @IsString()
  cuisine!: string;

  @ApiPropertyOptional({ example: 'Premium cuts of steak in a cozy environment.', description: 'Optional biography text.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: '$$$ Moderate', description: 'Optional price categorisation indicator.' })
  @IsOptional()
  @IsString()
  priceRange?: string;

  @ApiPropertyOptional({ example: 'contact@obsidiangrill.local', description: 'Optional restaurant contact email address.' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1 555-0150', description: 'Optional restaurant contact phone.' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'London', description: 'Optional address city.' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'United Kingdom', description: 'Optional address country.' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: ['Dine-In', 'Takeaway', 'Delivery'], description: 'Optional list of service features supported.', type: [String] })
  @IsOptional()
  @IsArray()
  services?: string[];
}

