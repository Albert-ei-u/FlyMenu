import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UploadMediaDto {
  @ApiProperty({ example: 'RESTAURANT', description: 'Type of entity that owns this asset (e.g. RESTAURANT, MENU_ITEM, USER).' })
  @IsString()
  ownerType!: string;

  @ApiProperty({ example: 'cuid1234', description: 'ID of the owner entity.' })
  @IsString()
  ownerId!: string;

  @ApiPropertyOptional({ example: 'cuid1234', description: 'Optional associated restaurant ID.' })
  @IsOptional()
  @IsString()
  restaurantId?: string;

  @ApiPropertyOptional({ example: 'cuid1234', description: 'Optional associated menu item ID.' })
  @IsOptional()
  @IsString()
  menuItemId?: string;
}

