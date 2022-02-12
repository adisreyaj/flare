import { Module } from '@nestjs/common';
import { ApiMediaController } from './api-media.controller';
import { ApiMediaService } from './api-media.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as cuid from 'cuid';
import { BullModule } from '@nestjs/bull';
import { MediaQueueService } from './queue/api-media.queue';
import { MediaQueueConsumer } from './queue/api-media-queue.consumer';

@Module({
  controllers: [ApiMediaController],
  providers: [ApiMediaService, MediaQueueService, MediaQueueConsumer],
  imports: [
    MulterModule.register({
      limits: {
        files: 5,
        fileSize: 2 * 1024 * 1024,
      },
      storage: multer.diskStorage({
        destination: 'uploads',
        filename: (req, file, cb) => {
          cb(null, cuid() + '-' + file.originalname.toLocaleLowerCase());
        },
      }),
    }),
    BullModule.registerQueue({
      name: 'media',
    }),
  ],
  exports: [ApiMediaService],
})
export class ApiMediaModule {}
