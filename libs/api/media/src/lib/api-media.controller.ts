import {
  Controller,
  InternalServerErrorException,
  Logger,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiMediaService } from './api-media.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Public } from '@flare/api/shared';
import { FileWithMeta } from './api-media.interface';
import { MediaUploadResponse } from '@flare/api-interfaces';

@Controller('media')
export class ApiMediaController {
  private readonly logger = new Logger(ApiMediaController.name);

  constructor(private apiMediaService: ApiMediaService) {}

  @Public()
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @UploadedFiles() files: FileWithMeta[]
  ): Promise<MediaUploadResponse> {
    this.logger.verbose(
      `Uploading ${files.map((file) => file.filename).join(',')} files`
    );
    /**
     *
     * Create a job id and pass it to the client.
     * Needs to be sent back with the flare.
     *
     * Job will be added to delete the files after the expiry time.
     * If the flare is successful, the job can be promoted to run immediately.
     */
    try {
      const job = await this.apiMediaService.cleanup(files ?? []);
      this.logger.verbose(`Cleanup job created: ${job.id}`);
      return {
        files: files.map((file) => ({
          name: file.filename,
          size: file.size,
          mime: file.mimetype,
        })),
        jobId: job.id,
      };
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException('Failed to upload image');
    }
  }
}
