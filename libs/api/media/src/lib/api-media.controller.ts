import {
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiMediaService } from './api-media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import { Public } from '@flare/api/shared';

@Controller('media')
export class ApiMediaController {
  constructor(private apiMediaService: ApiMediaService) {
    console.log(multer.name);
  }

  @Public()
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(@UploadedFiles() files: Express.Multer.File[]) {
    /**
     * TODO: start a job to clean up files
     *
     * Create a job id and pass it to the client.
     * Needs to be send back with the tweet.
     *
     * Job will be added to delete the files after the expiry time.
     * If the tweet is successful, the job can be promoted to run immediately.
     */
    const job = await this.apiMediaService.cleanup(files);
    return files.map((file) => ({
      fileName: file.filename,
      size: file.size,
      mime: file.mimetype,
      job: job.id,
    }));
  }
}
