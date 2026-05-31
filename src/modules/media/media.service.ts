import { Injectable } from '@nestjs/common';
import { MediaOwnerType } from '@prisma/client';
import { moduleStatus } from '../../common/module-status';
import { StorageService } from '../../integrations/storage/storage.service';
import { PrismaService } from '../../prisma/prisma.service';
import { UploadMediaDto } from './dto/upload-media.dto';

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  status() {
    return moduleStatus('media', 'Local Multer file uploads for restaurant covers, gallery assets, menu images, avatars, and documents.');
  }

  upload(file: Express.Multer.File, body: UploadMediaDto) {
    const stored = this.storage.toStoredFile(file);

    return this.prisma.mediaAsset.create({
      data: {
        ownerType: body.ownerType as MediaOwnerType,
        ownerId: body.ownerId,
        restaurantId: body.restaurantId,
        menuItemId: body.menuItemId,
        originalName: stored.originalName,
        filename: stored.filename,
        mimeType: stored.mimeType,
        sizeBytes: stored.sizeBytes,
        url: stored.url,
      },
    });
  }
}
