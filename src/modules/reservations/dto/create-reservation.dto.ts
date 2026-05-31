import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({ example: 'cuid1234restaurant', description: 'Associated restaurant ID.' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ example: 'Sarah Mitchell', description: 'Name of the guest booking the table.' })
  @IsString()
  guestName!: string;

  @ApiPropertyOptional({ example: '+1 555-0199', description: 'Optional guest contact phone.' })
  @IsOptional()
  @IsString()
  contactNumber?: string;

  @ApiProperty({ example: 4, description: 'Seating party size.' })
  @IsNumber()
  partySize!: number;

  @ApiProperty({ example: '2026-06-15', description: 'Reservation date (ISO Date format YYYY-MM-DD).' })
  @IsDateString()
  reservationDate!: string;

  @ApiProperty({ example: '19:30', description: 'Reservation slot time (e.g. 19:30).' })
  @IsString()
  reservationTime!: string;

  @ApiPropertyOptional({ example: 'cuid1234table', description: 'Optional table assigned to this reservation.' })
  @IsOptional()
  @IsString()
  tableId?: string;

  @ApiPropertyOptional({ example: 'Birthday', description: 'Optional dining occasion notes.' })
  @IsOptional()
  @IsString()
  occasion?: string;

  @ApiPropertyOptional({ example: 'Peanuts', description: 'Optional allergies declaration.' })
  @IsOptional()
  @IsString()
  allergies?: string;

  @ApiPropertyOptional({ example: 'Window table preferred.', description: 'Optional special requests notes.' })
  @IsOptional()
  @IsString()
  specialRequests?: string;

  @ApiPropertyOptional({ example: false, description: 'Mark true if accessibility accommodation is required.' })
  @IsOptional()
  @IsBoolean()
  accessibilityNeeds?: boolean;
}

