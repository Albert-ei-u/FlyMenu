import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFavoriteDto {
  @ApiProperty({ example: 'cuid12345user', description: 'ID of the customer.' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'cuid12345restaurant', description: 'ID of the restaurant.' })
  @IsString()
  restaurantId!: string;
}

