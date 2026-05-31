import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CheckAvailabilityDto {
  @IsString()
  restaurantId!: string;

  @IsDateString()
  date!: string;

  @Type(() => Number)
  @IsNumber()
  partySize!: number;
}
