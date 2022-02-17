import {
  HeaderPromoInput,
  HeaderPromoUpdateInput,
  PromoState,
} from '@flare/api-interfaces';
import { ApiMediaService } from '@flare/api/media';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { isNil } from 'lodash';
import {
  forkJoin,
  from,
  map,
  of,
  OperatorFunction,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
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
              description: input.description,
              title: input.title,
              price: input.price,
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

  applyHeaderPromo(promoId: string, user: CurrentUser) {
    return from(
      this.prisma.headerPromo.findUnique({
        where: {
          id: promoId,
        },
        select: {
          userId: true,
          state: true,
          image: true,
        },
      })
    ).pipe(
      switchMap((promo) => {
        const isPromoRejected = promo.state === PromoState.REJECTED;
        const hasAccess = promo.userId === user.id;
        if (isPromoRejected || !hasAccess) {
          return throwError(
            () => new BadRequestException('Promo is not available.')
          );
        }
        const updatePromoState$ = from(
          this.prisma.user.update({
            where: {
              id: user.id,
            },
            data: {
              preferences: {
                update: {
                  header: {
                    type: 'PROMO',
                    image: promo.image,
                  },
                },
              },
            },
          })
        );
        const updateUserPreference$ = this.prisma.headerPromo.update({
          where: {
            id: promoId,
          },
          data: {
            state: PromoState.ACTIVE,
          },
          select: {
            image: true,
            state: true,
          },
        });

        return forkJoin([updatePromoState$, updateUserPreference$]).pipe(
          map(() => ({
            success: true,
          }))
        );
      })
    );
  }

  // TODO: Make generic
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
