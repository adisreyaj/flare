import {
  AddCommentInput,
  AddLikeInput,
  BlockType,
  CreateFlareInput,
  RemoveCommentInput,
  RemoveLikeInput,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  catchError,
  from,
  of,
  OperatorFunction,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { ApiMediaService } from '@flare/api/media';
import { isNil } from 'lodash';
import { getFlareFieldsToInclude } from './flare.helper';
import { FileWithMeta } from '../../../media/src/lib/api-media.interface';

@Injectable()
export class FlareService {
  private readonly logger = new Logger(FlareService.name);

  constructor(
    private prisma: PrismaService,
    private readonly mediaService: ApiMediaService
  ) {}

  findPopularFlares(user: CurrentUser) {
    return from(
      this.prisma.flare.findMany({
        where: {
          deleted: false,
        },
        include: getFlareFieldsToInclude(user.id),
        orderBy: {
          likes: {
            _count: 'desc',
          },
        },
      })
    );
  }

  findAllFlaresFromFollowingUsers(user: CurrentUser) {
    const currenUsersFollowing$ = from(
      this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          following: {
            select: {
              id: true,
            },
          },
        },
      })
    );

    const getFlaresByAuthorIds$ = (userIds: string[]) =>
      from(
        this.prisma.flare.findMany({
          where: {
            deleted: false,
            authorId: {
              in: userIds,
            },
          },
          include: getFlareFieldsToInclude(user.id),
          orderBy: { createdAt: 'desc' },
        })
      );

    return currenUsersFollowing$.pipe(
      switchMap(({ following }) => {
        if (isNil(following)) {
          return of([]);
        }

        return getFlaresByAuthorIds$(
          following.map(({ id }) => id).concat(user.id)
        );
      })
    );
  }

  findOne(id: string, user: CurrentUser) {
    return this.prisma.flare.findUnique({
      where: {
        id,
      },
      include: getFlareFieldsToInclude(user.id),
    });
  }

  create(flare: CreateFlareInput, user: CurrentUser) {
    const createFlare$ = (data: FileWithMeta[] = []) =>
      from(
        this.prisma.flare.create({
          data: this.getCreateFlareData(flare, data, user),
          include: getFlareFieldsToInclude(user.id),
        })
      ).pipe(
        tap(() => {
          // Run if there are media files to upload
          if (flare.jobId) {
            this.mediaService.runJobImmediately(flare.jobId).then(() => {
              this.logger.log(
                `Job ${flare.jobId} promoted to start immediately`
              );
            });
          }
        })
      );
    /**
     * If there are images in the flare, we need to upload them to the media service
     * and then create the flare.
     */
    const query$ = isNil(flare.jobId)
      ? createFlare$()
      : from(this.mediaService.getJobData(flare.jobId)).pipe(
          this.handleFileUploadsIfJobExists(),
          switchMap((files) => createFlare$(files))
        );
    return query$.pipe(
      tap(() => {
        this.mediaService.runJobImmediately(flare.jobId);
      }),
      catchError((err) => {
        this.logger.error(err);
        if (err instanceof HttpException) {
          return throwError(() => err);
        }
        return throwError(() => new InternalServerErrorException());
      })
    );
  }

  delete(id: string, user: CurrentUser) {
    return from(
      this.prisma.flare.findUnique({
        where: { id },
        select: { authorId: true },
      })
    ).pipe(
      switchMap((flare) => {
        if (flare.authorId === user.id) {
          return from(
            this.prisma.flare.update({
              where: {
                id,
              },
              data: {
                deleted: true,
              },
            })
          );
        } else {
          return throwError(() => new ForbiddenException());
        }
      }),
      catchError((err) => {
        console.log(err);
        return throwError(() => new InternalServerErrorException());
      })
    );
  }

  addComment(input: AddCommentInput, user: CurrentUser) {
    return from(
      this.prisma.flare.update({
        where: {
          id: input.flareId,
        },
        data: {
          comments: {
            create: {
              text: input.text,
              authorId: user.id,
            },
          },
        },
        include: getFlareFieldsToInclude(user.id),
      })
    );
  }

  removeComment(input: RemoveCommentInput, user: CurrentUser) {
    return from(
      this.prisma.flare.update({
        where: {
          id: input.flareId,
        },
        data: {
          comments: {
            delete: {
              id: input.commentId,
            },
          },
        },
        include: getFlareFieldsToInclude(user.id),
      })
    );
  }

  addLike(input: AddLikeInput, user: CurrentUser) {
    return from(
      this.prisma.flare.update({
        where: {
          id: input.flareId,
        },
        data: {
          likes: {
            create: {
              reaction: input.reaction,
              authorId: user.id,
            },
          },
        },
        include: getFlareFieldsToInclude(user.id),
      })
    );
  }

  removeLike(input: RemoveLikeInput, user: CurrentUser) {
    return from(
      this.prisma.flare.update({
        where: {
          id: input.flareId,
        },
        data: {
          likes: {
            delete: {
              id: input.likeId,
            },
          },
        },
        include: getFlareFieldsToInclude(user.id),
      })
    );
  }

  private getCreateFlareData(
    flare: CreateFlareInput,
    data: FileWithMeta[],
    user: CurrentUser
  ) {
    return {
      blocks: {
        createMany: {
          data: flare.blocks.map((block) => ({
            ...block,
            ...(block.type === BlockType.images
              ? {
                  content: (data ?? []).map((file) => ({
                    name: file.filename,
                    type: file.mimetype,
                    size: file.size,
                  })),
                }
              : {}),
          })),
        },
      },
      deleted: false,
      authorId: user.id,
    };
  }

  private handleFileUploadsIfJobExists(): OperatorFunction<
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
