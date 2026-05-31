import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @ApiProperty({ example: 'John Doe', description: 'Name of the applicant.' })
  @IsString()
  applicantName!: string;

  @ApiProperty({ example: 'owner@obsidiangrill.local', description: 'Contact email address of the applicant.' })
  @IsEmail()
  applicantEmail!: string;

  @ApiProperty({ example: 'Obsidian Grill', description: 'Proposed name of the restaurant.' })
  @IsString()
  restaurantName!: string;

  @ApiProperty({ example: 'Steakhouse', description: 'Cuisine category of the restaurant.' })
  @IsString()
  category!: string;

  @ApiPropertyOptional({ example: 'London', description: 'City where the restaurant is located.' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'United Kingdom', description: 'Country where the restaurant is located.' })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ example: 'Premium steakhouse and cocktail lounge.', description: 'Brief description of restaurant concepts.' })
  @IsOptional()
  @IsString()
  description?: string;
}

