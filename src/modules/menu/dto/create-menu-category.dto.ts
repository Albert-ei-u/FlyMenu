import { IsOptional, IsString } from 'class-validator';

export class CreateMenuCategoryDto {
  @IsString()
  restaurantId!: string;

  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  slug?: string;
}
