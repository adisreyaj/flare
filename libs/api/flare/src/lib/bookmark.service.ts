import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import { Injectable } from '@nestjs/common';
import { from, map } from 'rxjs';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

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
