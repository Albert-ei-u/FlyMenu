import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class SignupDto {
  @ApiProperty({ example: 'Sarah Mitchell', description: 'Full name of the user.' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'sarah@flymenu.local', description: 'Unique email address for the account.' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8, description: 'Password (minimum 8 characters).' })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: '+44 20 7946 0958', description: 'Optional contact phone number.' })
  @IsOptional()
  @IsString()
  phone?: string;
}

