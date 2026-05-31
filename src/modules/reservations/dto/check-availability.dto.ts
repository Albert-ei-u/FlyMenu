import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CheckAvailabilityDto {
  @ApiProperty({ example: 'cuid1234', description: 'Restaurant ID for querying availability.' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ example: '2026-06-15', description: 'Reservation date (ISO Date String format YYYY-MM-DD).' })
  @IsDateString()
  date!: string;

  @ApiProperty({ example: 4, description: 'Number of guests in the dining party.' })
  @Type(() => Number)
  @IsNumber()
  partySize!: number;
}

