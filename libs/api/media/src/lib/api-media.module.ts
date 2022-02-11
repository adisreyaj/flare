import { Module } from '@nestjs/common';
import { ApiMediaController } from './api-media.controller';
import { ApiMediaService } from './api-media.service';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as cuid from 'cuid';

@Module({
  controllers: [ApiMediaController],
  providers: [ApiMediaService],
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
  ],
  exports: [ApiMediaService],
})
export class ApiMediaModule {}
