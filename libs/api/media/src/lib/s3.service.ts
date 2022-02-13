import { Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { FileWithMeta } from './api-media.interface';

@Injectable()
export class S3Service {
  s3: S3Client;
  private readonly logger = new Logger(S3Service.name);
  constructor(private readonly config: ConfigService) {
    this.s3 = new S3Client({
      endpoint: config.get('S3_ENDPOINT'),
      region: config.get('S3_REGION'),
      credentials: {
        accessKeyId: config.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: config.get('S3_SECRET_ACCESS_KEY'),
      },
    });
    this.logger.log(`S3 Service initialized`);
  }

  async upload(file: FileWithMeta) {
    return this.s3.send(
      new PutObjectCommand({
        Bucket: this.config.get('S3_BUCKET'),
        Key: file.filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );
  }
}
