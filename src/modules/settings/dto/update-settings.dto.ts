import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateSettingsDto {
  @ApiPropertyOptional({ example: 'Obsidian Grill', description: 'Updated restaurant name.' })
  @IsOptional()
  @IsString()
  restaurantName?: string;

  @ApiPropertyOptional({ example: 'contact@obsidiangrill.local', description: 'Updated contact email address.' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ example: '+1 555-0150', description: 'Updated contact phone number.' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Main St, London', description: 'Updated physical address line.' })
  @IsOptional()
  @IsString()
  addressLine?: string;

  @ApiPropertyOptional({ example: ['Dine-In', 'Takeaway'], description: 'Updated service options list.', type: [String] })
  @IsOptional()
  @IsArray()
  services?: string[];

  @ApiPropertyOptional({ example: true, description: 'Enable email notifications for orders and reservations.' })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Enable SMS alerts.' })
  @IsOptional()
  @IsBoolean()
  smsAlerts?: boolean;

  @ApiPropertyOptional({ example: true, description: 'Enable order updates.' })
  @IsOptional()
  @IsBoolean()
  orderUpdates?: boolean;
}

