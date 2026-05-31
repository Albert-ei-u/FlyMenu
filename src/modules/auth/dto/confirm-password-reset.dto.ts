import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ConfirmPasswordResetDto {
  @ApiProperty({ example: 'abc123resettoken', description: 'Reset token received by email.' })
  @IsString()
  token!: string;

  @ApiProperty({ example: 'NewPass123!', minLength: 8, description: 'The new password (minimum 8 characters).' })
  @IsString()
  @MinLength(8)
  newPassword!: string;
}

