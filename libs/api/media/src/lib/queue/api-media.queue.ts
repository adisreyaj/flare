import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Job, Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { FileWithMeta } from '../api-media.interface';
import cuid = require('cuid');

@Injectable()
export class MediaQueueService {
  private readonly logger = new Logger(MediaQueueService.name);

  constructor(@InjectQueue('media') private mediaQueue: Queue) {}

  async cleanupImage(
    files: FileWithMeta[],
    expiresAfterMs: number = ONE_DAY_IN_MILLISECONDS
  ) {
    return this.mediaQueue.add(
      'cleanup-images',
      { files },
      {
        delay: expiresAfterMs,
        jobId: cuid(),
        removeOnComplete: true,
      }
    );
  }

  async runJobImmediately(jobId: string) {
    try {
      const job = await this.mediaQueue.getJob(jobId);
      if (job) {
        return await job.promote();
      }
      return 'OK';
    } catch (e) {
      throw new InternalServerErrorException('Cleanup Failed');
    }
  }

  async getJobData<Data = { files: FileWithMeta[] }>(
    id: string
  ): Promise<Data> {
    try {
      const job: Job<Data> = await this.mediaQueue.getJob(id);
      if (job) {
        return job.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }
}

const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
