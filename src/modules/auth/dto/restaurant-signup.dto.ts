import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RestaurantSignupDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the owner.' })
  @IsString()
  fullName!: string;

  @ApiProperty({ example: 'john@restaurant.com', description: 'Business email address.' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'FlyMenu Bistro', description: 'Name of the restaurant.' })
  @IsString()
  restaurantName!: string;

  @ApiProperty({ example: 'StrongPass123!', minLength: 8, description: 'Password (minimum 8 characters).' })
  @IsString()
  @MinLength(8)
  password!: string;
}
