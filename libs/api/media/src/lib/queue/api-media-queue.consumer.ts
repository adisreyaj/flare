import {
  OnQueueActive,
  OnQueueWaiting,
  Process,
  Processor,
} from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs-extra';

@Processor('media')
export class MediaQueueConsumer {
  @Process('cleanup-images')
  async cleanupImages(job: Job<{ files: Express.Multer.File[] }>) {
    const deleteFilesPromises = job.data.files.map((file) =>
      fs.remove(file.path)
    );
    await Promise.all(deleteFilesPromises);
    console.log('Images Deleted');
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`Processing job ${job.id} of type ${job.name}`);
  }

  @OnQueueWaiting()
  onWaiting(jobId: string) {
    console.log(`Waiting job ${jobId}`);
  }
}
