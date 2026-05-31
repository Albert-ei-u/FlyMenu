import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddApplicationDocumentDto {
  @ApiProperty({ example: 'Food Hygiene License', description: 'Label describing what the document is.' })
  @IsString()
  label!: string;

  @ApiProperty({ example: '/uploads/hygiene-license.pdf', description: 'URL reference path where document file is hosted.' })
  @IsString()
  fileUrl!: string;
}

