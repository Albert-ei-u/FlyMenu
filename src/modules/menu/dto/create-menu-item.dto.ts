import { IsArray, IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMenuItemDto {
  @IsString()
  restaurantId!: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @IsOptional()
  @IsBoolean()
  isHighlighted?: boolean;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsArray()
  allergens?: string[];
}
