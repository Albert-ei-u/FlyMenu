import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { randomUUID } from 'node:crypto';
import { mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { diskStorage } from 'multer';

export type StoredFile = {
  originalName: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  path: string;
  url: string;
};

@Injectable()
export class StorageService {
  constructor(private readonly config: ConfigService) {}

  async getUploadDestination(folder = 'general') {
    const uploadsDir = this.config.get<string>('UPLOADS_DIR', 'uploads');
    const destination = join(process.cwd(), uploadsDir, folder);
    await mkdir(destination, { recursive: true });
    return destination;
  }

  createMulterOptions(folder = 'general'): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: async (_request, _file, callback) => {
          try {
            callback(null, await this.getUploadDestination(folder));
          } catch (error) {
            callback(error as Error, '');
          }
        },
        filename: (_request, file, callback) => {
          callback(null, this.buildFilename(file.originalname));
        },
      }),
    };
  }

  buildFilename(originalName: string) {
    const extension = extname(originalName);
    return `${randomUUID()}${extension}`;
  }

  toStoredFile(file: Express.Multer.File): StoredFile {
    const publicUploadsPath = this.config.get<string>('PUBLIC_UPLOADS_PATH', '/uploads');
    const relativeUrl = file.path.replace(process.cwd(), '').replace(/\\/g, '/');

    return {
      originalName: file.originalname,
      filename: file.filename,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      path: file.path,
      url: `${publicUploadsPath}${relativeUrl.replace(/^\/?uploads\/?/, '/')}`,
    };
  }
}
