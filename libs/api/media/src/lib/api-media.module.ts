import { Module } from '@nestjs/common';
import { ApiMediaController } from './api-media.controller';
import { ApiMediaService } from './api-media.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as cuid from 'cuid';
import { BullModule } from '@nestjs/bull';
import { MediaQueueService } from './queue/api-media.queue';
import { MediaQueueConsumer } from './queue/api-media-queue.consumer';
import { S3Service } from './s3.service';
import { ConfigModule } from '@nestjs/config';
import { FileWithMeta } from './api-media.interface';
import { getExtension } from 'mime';

const ALLOWED_MIME_TYPE = ['image/jpeg', 'image/png', 'image/gif'];
@Module({
  controllers: [ApiMediaController],
  providers: [
    ApiMediaService,
    MediaQueueService,
    MediaQueueConsumer,
    S3Service,
  ],
  imports: [
    MulterModule.register({
      limits: {
        files: 5,
        fileSize: 2 * 1024 * 1024,
      },
      fileFilter(
        _: any,
        file: FileWithMeta,
        callback: (error: Error | null, acceptFile: boolean) => void
      ) {
        if (ALLOWED_MIME_TYPE.includes(file.mimetype)) {
          callback(null, true);
        } else {
          return callback(
            new Error('Only .png, .jpg and .jpeg format allowed!'),
            false
          );
        }
      },
      storage: multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
          cb(null, `${cuid()}.${getExtension(file.mimetype)}`);
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'media',
    }),
    ConfigModule,
  ],
  exports: [ApiMediaService, S3Service],
})
export class ApiMediaModule {}
