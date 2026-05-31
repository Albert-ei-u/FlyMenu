import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReviewApplicationDto {
  @ApiPropertyOptional({ example: 'Verified hygiene certificates and approved setup.', description: 'Review notes explaining decision.' })
  @IsOptional()
  @IsString()
  reviewNotes?: string;
}

