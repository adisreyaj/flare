import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs-extra';
import { FileWithMeta } from '../api-media.interface';
import { Logger } from '@nestjs/common';

@Processor('media')
export class MediaQueueConsumer {
  logger = new Logger(MediaQueueConsumer.name);
  @Process('cleanup-images')
  async cleanupImages(job: Job<{ files: FileWithMeta[] }>) {
    try {
      const deleteFilesPromises = (job.data.files ?? []).map((file) =>
        fs.remove(file.path)
      );
      await Promise.all(deleteFilesPromises);
      this.logger.verbose('Images Deleted');
    } catch (e) {
      this.logger.error('Error Deleting Images', e);
    }
  }
}
