import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

class CreateOrderItemDto {
  @ApiPropertyOptional({ example: 'cuid1234item', description: 'Optional menu item ID.' })
  @IsOptional()
  @IsString()
  menuItemId?: string;

  @ApiProperty({ example: 'Margherita Pizza', description: 'Name of the item ordered.' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 2, description: 'Quantity ordered.' })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ example: 12.99, description: 'Unit price.' })
  @IsNumber()
  unitPrice!: number;

  @ApiPropertyOptional({ example: 'Extra cheese, no onions.', description: 'Optional special notes on the preparation.' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class CreateOrderDto {
  @ApiProperty({ example: 'cuid1234restaurant', description: 'Restaurant ID where order is placed.' })
  @IsString()
  restaurantId!: string;

  @ApiProperty({ example: 'Sarah Mitchell', description: 'Name of the customer placing the order.' })
  @IsString()
  customerName!: string;

  @ApiPropertyOptional({ example: '+1 555-0199', description: 'Optional customer contact phone.' })
  @IsOptional()
  @IsString()
  customerPhone?: string;

  @ApiProperty({ type: [CreateOrderItemDto], description: 'List of order line items.' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];

  @ApiProperty({ example: 25.98, description: 'Total order price sum.' })
  @IsNumber()
  total!: number;
}

