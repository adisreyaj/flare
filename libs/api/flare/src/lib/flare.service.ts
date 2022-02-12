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
import { Prisma } from '@prisma/client';
import { catchError, from, of, switchMap, tap, throwError } from 'rxjs';
import { ApiMediaService } from '@flare/api/media';
import { isNil } from 'lodash';

@Injectable()
export class FlareService {
  private readonly logger = new Logger(FlareService.name);

  constructor(
    private prisma: PrismaService,
    private readonly mediaService: ApiMediaService
  ) {}

  include = (userId: string): Prisma.FlareInclude => ({
    comments: true,
    author: true,
    blocks: true,
    likes: {
      where: {
        authorId: userId,
      },
    },
    bookmarks: {
      where: {
        author: {
          id: userId,
        },
      },
    },
    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
  });

  findAll(user: CurrentUser) {
    return this.prisma.flare.findMany({
      where: {
        deleted: false,
      },
      include: this.include(user.id),
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string, user: CurrentUser) {
    return this.prisma.flare.findUnique({
      where: {
        id,
      },
      include: this.include(user.id),
    });
  }

  create(flare: CreateFlareInput, user: CurrentUser) {
    return from(this.mediaService.getJobData(flare.jobId)).pipe(
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
      switchMap((data) => {
        if (isNil(data)) {
          return throwError(
            () => new InternalServerErrorException('Media upload error')
          );
        } else {
          return of(data);
        }
      }),
      switchMap((data) => {
        return from(
          this.prisma.flare.create({
            data: {
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
            },
            include: this.include(user.id),
          })
        );
      }),
      tap(() => {
        this.mediaService.runJobImmediately(flare.jobId).then(() => {
          this.logger.log(`Job ${flare.jobId} promoted to start immediately`);
        });
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
        include: this.include(user.id),
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
        include: this.include(user.id),
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
        include: this.include(user.id),
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
        include: this.include(user.id),
      })
    );
  }
}
