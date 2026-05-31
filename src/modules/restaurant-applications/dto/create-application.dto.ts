import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  applicantName!: string;

  @IsEmail()
  applicantEmail!: string;

  @IsString()
  restaurantName!: string;

  @IsString()
  category!: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
