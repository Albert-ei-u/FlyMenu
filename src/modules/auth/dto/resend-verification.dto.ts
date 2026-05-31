import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ResendVerificationDto {
  @ApiProperty({ example: 'sarah@flymenu.local', description: 'Email address of the account to resend the verification code to.' })
  @IsEmail()
  email!: string;
}
