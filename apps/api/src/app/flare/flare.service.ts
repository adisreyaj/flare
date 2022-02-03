import { CreateFlareInput } from '@flare/api-interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, from, throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FlareService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.flare.findMany({
      include: {
        comments: true,
        author: true,
        blocks: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.flare.findUnique({
      where: {
        id,
      },
      include: {
        comments: true,
        author: true,
        blocks: true,
      },
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
        include: {
          comments: true,
          author: true,
          blocks: true,
        },
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
}
