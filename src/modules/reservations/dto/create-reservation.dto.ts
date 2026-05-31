import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  restaurantId!: string;

  @IsString()
  guestName!: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsNumber()
  partySize!: number;

  @IsDateString()
  reservationDate!: string;

  @IsString()
  reservationTime!: string;

  @IsOptional()
  @IsString()
  tableId?: string;

  @IsOptional()
  @IsString()
  occasion?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  specialRequests?: string;

  @IsOptional()
  @IsBoolean()
  accessibilityNeeds?: boolean;
}
