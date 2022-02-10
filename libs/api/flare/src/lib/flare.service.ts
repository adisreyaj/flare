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
import { catchError, from, switchMap, throwError } from 'rxjs';

@Injectable()
export class FlareService {
  include = {
    comments: true,
    author: true,
    blocks: true,
    likes: true,
  };

  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.flare.findMany({
      where: {
        deleted: false,
      },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: string) {
    return this.prisma.flare.findUnique({
      where: {
        id,
      },
      include: this.include,
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
        include: this.include,
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
        include: this.include,
      })
    );
  }

  removeComment(input: RemoveCommentInput) {
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
        include: this.include,
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
        include: this.include,
      })
    );
  }

  removeLike(input: RemoveLikeInput) {
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
        include: this.include,
      })
    );
  }
}
