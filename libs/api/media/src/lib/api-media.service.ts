import { Injectable, Logger } from '@nestjs/common';
import { MediaQueueService } from './queue/api-media.queue';
import { FileWithMeta } from './api-media.interface';
import * as fs from 'fs-extra';
import { S3Service } from './s3.service';
import { Job } from 'bull';

@Injectable()
export class ApiMediaService {
  private readonly logger = new Logger(ApiMediaService.name);

  constructor(
    private readonly mediaQueue: MediaQueueService,
    private readonly s3: S3Service
  ) {}

  cleanup(files: Express.Multer.File[]): Promise<Job> {
    return this.mediaQueue.cleanupImage(files);
  }

  /**
   * Run job immediately regardless of the delay.
   * Call when the flare is posted successfully. This will immediately
   * run the cleanup for flare images used in the flare.
   * @param jobId - job id
   */
  runJobImmediately(jobId: string) {
    if (!jobId) {
      return;
    }
    return this.mediaQueue.runJobImmediately(jobId);
  }

  async deleteMedia(fileNames: string[]) {
    this.logger.verbose(`Deleting media: ${fileNames}`);
    return Promise.all(fileNames.map((fileName) => this.s3.delete(fileName)));
  }

  async uploadToCloud(files: FileWithMeta[]): Promise<FileWithMeta[]> {
    const filesRead = await Promise.all(
      (files ?? []).map((file) => fs.readFile(file.path))
    );
    const filesToUpload = filesRead.map((file, index) => ({
      ...files[index],
      buffer: filesRead[index],
    }));

    try {
      const results = await Promise.all(
        (filesToUpload ?? []).map((file) => this.s3.upload(file))
      );
      const uploadsAreSuccessful = results.every(
        (result) => result.$metadata.httpStatusCode === 200
      );
      if (uploadsAreSuccessful) {
        this.logger.verbose(`Uploaded ${filesToUpload.length} files to S3`);
        return files.map((file) => ({ ...file, buffer: null }));
      } else {
        this.logger.error(
          `Failed to upload ${filesToUpload.length} files to S3`
        );
        return null;
      }
      // TODO: Cleanup for error conditions
    } catch (e) {
      return null;
    }
  }

  getJobData(jobId: string) {
    return this.mediaQueue.getJobData<{ files: FileWithMeta[] }>(jobId);
  }
}
