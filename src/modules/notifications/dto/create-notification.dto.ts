import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'cuid1234', description: 'ID of the recipient user.' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'New Order Received', description: 'Brief title for the notification.' })
  @IsString()
  title!: string;

  @ApiPropertyOptional({ example: 'You have received a new order for Obsidian Grill.', description: 'Optional body detail text.' })
  @IsOptional()
  @IsString()
  body?: string;

  @ApiPropertyOptional({ example: 'ORDER_STATUS', description: 'Optional notification type descriptor.' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiPropertyOptional({ example: '/orders/cuid1234', description: 'Optional URL or route triggered when user clicks notification.' })
  @IsOptional()
  @IsString()
  actionUrl?: string;
}

