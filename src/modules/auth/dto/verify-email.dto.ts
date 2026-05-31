import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'sarah@flymenu.local', description: 'Email address of the account to verify.' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '482910', description: '6-digit verification code sent to your email.' })
  @IsString()
  @Length(6, 6, { message: 'Verification code must be exactly 6 digits.' })
  code!: string;
}
