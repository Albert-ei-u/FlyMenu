import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  addressLine?: string;

  @IsOptional()
  @IsArray()
  services?: string[];

  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @IsOptional()
  @IsBoolean()
  smsAlerts?: boolean;

  @IsOptional()
  @IsBoolean()
  orderUpdates?: boolean;
}
