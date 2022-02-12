import { Injectable } from '@nestjs/common';
import { MediaQueueService } from './queue/api-media.queue';
import cuid = require('cuid');

@Injectable()
export class ApiMediaService {
  constructor(private readonly mediaQueue: MediaQueueService) {}

  cleanup(files: Express.Multer.File[]) {
    return this.mediaQueue.cleanupImage(files, cuid(), 10000);
  }

  /**
   * Run job immediately regardless of the delay.
   * Call when the flare is posted successfully. This will immediately
   * run the cleanup for flare images used in the flare.
   * @param jobId - job id
   */
  runJobImmediately(jobId: string) {
    return this.mediaQueue.runJobImmediately(jobId);
  }
}
