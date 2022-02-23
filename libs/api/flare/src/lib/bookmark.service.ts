import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import { Injectable } from '@nestjs/common';
import { from, map, take } from 'rxjs';
import { getFlareFieldsToInclude } from './flare.helper';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  findAllBookmarked(user: CurrentUser) {
    return from(
      this.prisma.bookmark.findMany({
        where: {
          authorId: user.id,
        },
        select: {
          flare: {
            include: getFlareFieldsToInclude(user.id),
          },
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    ).pipe(
      map((result) => result.map((bookmark) => bookmark.flare)),
      take(1)
    );
  }

  bookmark(flareId: string, user: CurrentUser) {
    return this.prisma.bookmark.create({
      data: {
        flareId,
        authorId: user.id,
      },
      include: {
        flare: true,
        author: true,
      },
    });
  }

  removeBookmark(id: string, user: CurrentUser) {
    return from(
      this.prisma.bookmark.deleteMany({
        where: {
          id,
          authorId: user.id,
        },
      })
    ).pipe(
      map(() => ({
        success: true,
      }))
    );
  }
}
