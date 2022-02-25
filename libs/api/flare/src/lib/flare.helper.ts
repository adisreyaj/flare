import { Prisma } from '@prisma/client';

export const getFlareFieldsToInclude = (
  userId: string
): Prisma.FlareInclude => ({
  comments: {
    include: {
      author: true,
    },
  },
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
