import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadMediaDto } from './dto/upload-media.dto';
import { MediaService } from './media.service';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Get()
  @ApiOperation({ summary: 'Module status' })
  status() {
    return this.mediaService.status();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload file', description: 'Upload an image or document asset. Saves locally and registers reference in media table.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Local file to upload (image/png, image/jpeg, pdf, etc.)',
        },
        ownerType: { type: 'string', example: 'RESTAURANT', description: 'Type of entity that owns this asset.' },
        ownerId: { type: 'string', example: 'cuid1234', description: 'ID of the owner entity.' },
        restaurantId: { type: 'string', example: 'cuid1234', description: 'Optional associated restaurant ID.' },
        menuItemId: { type: 'string', example: 'cuid1234', description: 'Optional associated menu item ID.' },
      },
      required: ['file', 'ownerType', 'ownerId'],
    },
  })
  upload(@UploadedFile() file: Express.Multer.File, @Body() body: UploadMediaDto) {
    return this.mediaService.upload(file, body);
  }
}

