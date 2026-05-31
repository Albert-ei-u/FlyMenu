import { IsString } from 'class-validator';

export class AddApplicationDocumentDto {
  @IsString()
  label!: string;

  @IsString()
  fileUrl!: string;
}
