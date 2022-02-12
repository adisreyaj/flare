import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class MediaQueueService {
  constructor(@InjectQueue('media') private mediaQueue: Queue) {}

  async cleanupImage(
    files: Express.Multer.File[],
    jobId: string,
    expiresAfterMs: number = ONE_DAY_IN_MILLISECONDS
  ) {
    return this.mediaQueue.add(
      'cleanup-images',
      { files },
      {
        delay: expiresAfterMs,
        jobId,
        removeOnComplete: true,
      }
    );
  }

  async runJobImmediately(jobId: string) {
    const job = await this.mediaQueue.getJob(jobId);
    if (job) {
      return await job.promote();
    }
    return;
  }
}

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
