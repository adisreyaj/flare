import { Injectable } from '@nestjs/common';
import { MediaQueueService } from './queue/api-media.queue';
import cuid = require('cuid');

@Injectable()
export class ApiMediaService {
  constructor(private readonly mediaQueue: MediaQueueService) {}

  cleanup(files: Express.Multer.File[]) {
    return this.mediaQueue.cleanupImage(files, cuid(), 10000);
  }
}
