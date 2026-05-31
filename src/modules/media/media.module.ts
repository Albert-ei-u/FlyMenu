import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { StorageModule } from '../../integrations/storage/storage.module';
import { StorageService } from '../../integrations/storage/storage.service';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    StorageModule,
    MulterModule.registerAsync({
      imports: [StorageModule],
      inject: [StorageService],
      useFactory: (storage: StorageService) => storage.createMulterOptions('general'),
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
