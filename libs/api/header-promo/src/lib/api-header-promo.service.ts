import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CurrentUser } from '@flare/api/shared';
import {
  HeaderPromoInput,
  HeaderPromoUpdateInput,
  PromoState,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { isNil } from 'lodash';
import { from, of, OperatorFunction, switchMap, tap, throwError } from 'rxjs';
import { ApiMediaService } from '@flare/api/media';
import { FileWithMeta } from '../../../media/src/lib/api-media.interface';

@Injectable()
export class ApiHeaderPromoService {
  private readonly logger = new Logger(ApiHeaderPromoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: ApiMediaService
  ) {}

  getAll(user: CurrentUser) {
    return this.prisma.headerPromo.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        sponsor: true,
      },
    });
  }

  getById(id: string, user: CurrentUser) {
    return this.prisma.headerPromo.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        user: true,
        sponsor: true,
      },
    });
  }

  create(input: HeaderPromoInput, jobId: string, user: CurrentUser) {
    if (isNil(jobId)) {
      throw new BadRequestException('Media is required.');
    }

    return from(this.mediaService.getJobData(jobId)).pipe(
      this.handleFileUploadsIfJobExists(),
      switchMap(([file]) => {
        const image = {
          name: file.filename,
          type: file.mimetype,
          size: file.size,
        };
        return from(
          this.prisma.headerPromo.create({
            data: {
              ...input,
              userId: user.id,
              sponsorId: user.id,
              state: PromoState.PENDING,
              image,
            },
          })
        );
      }),
      tap(() => {
        this.mediaService.runJobImmediately(jobId);
      })
    );
  }

  update(id: string, input: HeaderPromoUpdateInput, user: CurrentUser) {
    return this.prisma.headerPromo.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: input,
    });
  }

  delete(id: string, user: CurrentUser) {
    return this.prisma.headerPromo.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });
  }

  protected handleFileUploadsIfJobExists(): OperatorFunction<
    { files: FileWithMeta[] },
    FileWithMeta[]
  > {
    return (source) => {
      return source.pipe(
        switchMap((data) => {
          if (isNil(data)) {
            this.logger.error('Job Data not found');
            return throwError(
              () => new InternalServerErrorException('Media upload error')
            );
          } else {
            return from(this.mediaService.uploadToCloud(data.files));
          }
        }),
        switchMap((data: FileWithMeta[]) => {
          if (isNil(data)) {
            return throwError(
              () => new InternalServerErrorException('Media upload error')
            );
          } else {
            return of(data);
          }
        })
      );
    };
  }
}
