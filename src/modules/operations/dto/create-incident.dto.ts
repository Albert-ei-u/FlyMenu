import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @ApiProperty({ example: 'cuid1234', description: 'ID of the restaurant where incident occurred.' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ example: 'Kitchen Terminal Offline', description: 'Headline title detailing the incident.' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'Terminal #3', description: 'Optional affected asset resource name.' })
  @IsOptional()
  @IsString()
  resource?: string;

  @ApiProperty({ example: 'HIGH', description: 'Incident severity level (e.g. LOW, MEDIUM, HIGH, CRITICAL).' })
  @IsString()
  severity!: string;

  @ApiPropertyOptional({ example: '10:15 AM - Power outage in kitchen. 10:20 AM - Terminal failed to reboot.', description: 'Optional chronological notes on the event.' })
  @IsOptional()
  @IsString()
  timeline?: string;
}

