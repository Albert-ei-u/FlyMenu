import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  fullName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  loyaltyTier?: string;
}
