import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MenuItemStatus } from '@prisma/client';

export class CreateMenuItemDto {
  @ApiPropertyOptional({ example: 'cuid1234restaurant', description: 'Associated restaurant ID.' })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiPropertyOptional({ example: 'cuid1234category', description: 'Optional menu category ID.' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ example: 'Margherita Pizza', description: 'Name of the menu item.' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ example: 'Classic pizza with fresh mozzarella and basil.', description: 'Optional item description.' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 12.99, description: 'Price of the menu item.' })
  @IsNumber()
  price!: number;

  @ApiPropertyOptional({ example: 'AVAILABLE', enum: MenuItemStatus, description: 'Manual status of the menu item.' })
  @IsOptional()
  @IsEnum(MenuItemStatus)
  status?: MenuItemStatus;

  @ApiPropertyOptional({ example: true, description: 'Whether the item is currently visible/orderable on the menu.' })
  @IsOptional()
  @IsBoolean()
  isLive?: boolean;

  @ApiPropertyOptional({ example: false, description: 'Highlight this item (e.g. chef\'s special).' })
  @IsOptional()
  @IsBoolean()
  isHighlighted?: boolean;

  @ApiPropertyOptional({ example: ['Vegetarian', 'Best Seller'], description: 'Optional category tag tags.', type: [String] })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @ApiPropertyOptional({ example: ['Gluten', 'Dairy'], description: 'Optional list of allergens.', type: [String] })
  @IsOptional()
  @IsArray()
  allergens?: string[];
}