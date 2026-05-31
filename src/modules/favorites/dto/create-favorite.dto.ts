import { IsString } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  userId!: string;

  @IsString()
  restaurantId!: string;
}
