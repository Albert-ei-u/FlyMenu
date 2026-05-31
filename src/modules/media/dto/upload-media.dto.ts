import { IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @IsString()
  ownerType!: string;

  @IsString()
  ownerId!: string;

  @IsOptional()
  @IsString()
  restaurantId?: string;

  @IsOptional()
  @IsString()
  menuItemId?: string;
}
