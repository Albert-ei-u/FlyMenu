import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: 'cuid1234restaurant', description: 'ID of the restaurant being reviewed.' })
  @IsString()
  restaurantId!: string;

  @ApiPropertyOptional({ example: 'cuid1234order', description: 'Optional order associated with the review.' })
  @IsOptional()
  @IsString()
  orderId?: string;

  @ApiPropertyOptional({ example: 'cuid1234customer', description: 'Optional customer ID making the review.' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 5, minimum: 1, maximum: 5, description: 'Rating score from 1 to 5.' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating!: number;

  @ApiPropertyOptional({ example: ['Great Service', 'Delicious Food'], description: 'Optional tags describing the experience.', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: 'The steaks were cooked perfectly and the service was top notch.', description: 'Optional review comments text.' })
  @IsOptional()
  @IsString()
  comment?: string;
}

