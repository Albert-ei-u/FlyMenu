import { IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @IsString()
  userId!: string;

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  actionUrl?: string;
}
