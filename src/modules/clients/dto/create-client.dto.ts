import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the client.' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'john.doe@example.com', description: 'Contact email address.' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+1 555-0199', description: 'Optional contact phone number.' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'GOLD', description: 'Optional loyalty tier (e.g. SILVER, GOLD, PLATINUM).' })
  @IsOptional()
  @IsString()
  loyaltyTier?: string;
}

