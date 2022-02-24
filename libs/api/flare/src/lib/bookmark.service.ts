import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import { Injectable } from '@nestjs/common';
import { getFlareFieldsToInclude } from './flare.helper';

@Injectable()
export class BookmarkService {
  constructor(private prisma: PrismaService) {}

  async findAllBookmarked(user: CurrentUser) {
    const bookmarks = await this.prisma.bookmark.findMany({
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
    });
    return bookmarks.map((bookmark) => bookmark.flare);
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

  async removeBookmark(id: string, user: CurrentUser) {
    await this.prisma.bookmark.deleteMany({
      where: {
        id,
        authorId: user.id,
      },
    });
    return { success: true };
  }
}
