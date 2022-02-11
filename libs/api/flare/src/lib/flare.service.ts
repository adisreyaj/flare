import {
  AddCommentInput,
  AddLikeInput,
  CreateFlareInput,
  RemoveCommentInput,
  RemoveLikeInput,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { catchError, from, switchMap, throwError } from 'rxjs';

@Injectable()
export class FlareService {
  constructor(private prisma: PrismaService) {}

  include = (userId: string): Prisma.FlareInclude => ({
    comments: true,
    author: true,
    blocks: true,
    likes: {
      where: {
        authorId: userId,
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
    return from(
      this.prisma.flare.create({
        data: {
          blocks: {
            createMany: {
              data: flare.blocks.map((block) => ({
                ...block,
                ...(block?.images
                  ? { images: { create: { data: block.images } } }
                  : {}),
              })),
            },
          },
          deleted: false,
          authorId: user.id,
        },
        include: this.include(user.id),
      })
    ).pipe(
      catchError((err) => {
        console.log(err);
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
