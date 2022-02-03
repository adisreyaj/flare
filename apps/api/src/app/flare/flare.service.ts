import {
  AddCommentInput,
  AddLikeInput,
  CreateFlareInput,
  RemoveCommentInput,
  RemoveLikeInput,
} from '@flare/api-interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, from, throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

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
      include: this.include,
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

  create(flare: CreateFlareInput) {
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
          authorId: '', //TODO: Get user id from jwt
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

  delete(id: string) {
    return from(
      this.prisma.flare.delete({
        where: {
          id,
        },
      })
    ).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => new InternalServerErrorException());
      })
    );
  }

  addComment(input: AddCommentInput) {
    return from(
      this.prisma.flare.update({
        where: {
          id: input.flareId,
        },
        data: {
          comments: {
            create: {
              text: input.text,
              authorId: '', //TODO: Get user id from jwt
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

  addLike(input: AddLikeInput) {
    return from(
      this.prisma.flare.update({
        where: {
          id: input.flareId,
        },
        data: {
          likes: {
            create: {
              reaction: input.reaction,
              authorId: '', //TODO: Get user id from jwt
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
