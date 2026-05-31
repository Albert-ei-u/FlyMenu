import { IsOptional, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsString()
  restaurantId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  resource?: string;

  @IsString()
  severity!: string;

  @IsOptional()
  @IsString()
  timeline?: string;
}
