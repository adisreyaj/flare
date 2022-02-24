import {
  AddCommentInput,
  AddLikeInput,
  BlockType,
  CreateFlareInput,
  NotificationType,
  RemoveCommentInput,
  RemoveLikeInput,
} from '@flare/api-interfaces';
import { ApiMediaService, FileWithMeta } from '@flare/api/media';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { getFlareFieldsToInclude } from './flare.helper';

@Injectable()
export class FlareService {
  private readonly logger = new Logger(FlareService.name);

  constructor(
    private prisma: PrismaService,
    private readonly mediaService: ApiMediaService
  ) {}

  findPopularFlares(user: CurrentUser) {
    return this.prisma.flare.findMany({
      where: {
        deleted: false,
      },
      include: getFlareFieldsToInclude(user.id),
      orderBy: {
        likes: {
          _count: 'desc',
        },
      },
    });
  }

  async findAllFlaresFromFollowingUsers(user: CurrentUser) {
    const currentUsersFollowing = await this.prisma.user.findUnique({
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
    });

    const getFlaresByAuthorIds = async (userIds: string[]) =>
      await this.prisma.flare.findMany({
        where: {
          deleted: false,
          authorId: {
            in: userIds,
          },
        },
        include: getFlareFieldsToInclude(user.id),
        orderBy: { createdAt: 'desc' },
      });

    /**
     * Get all flares from users that the current user is following
     * and the user itself
     */
    return getFlaresByAuthorIds(
      (currentUsersFollowing.following ?? [])
        .map(({ id }) => id)
        .concat(user.id)
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

  async create(flareInput: CreateFlareInput, user: CurrentUser) {
    const createFlare = (data: FileWithMeta[] = []) =>
      this.prisma.flare.create({
        data: this.getCreateFlareData(flareInput, data, user),
        include: getFlareFieldsToInclude(user.id),
      });

    const userFollowers = await this.prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        followers: {
          select: {
            id: true,
          },
        },
      },
    });
    const followerIds = userFollowers.followers.map(({ id }) => id);
    const hadMediaAssociatedWithFlare = flareInput.jobId;

    const cleanupFilesAfterUpload = () => {
      if (hadMediaAssociatedWithFlare) {
        return this.mediaService.runJobImmediately(flareInput.jobId);
      }
    };

    const sendNotifications = (flare, users: string[]) =>
      this.prisma.notification.createMany({
        data: users.map((id) => ({
          type: NotificationType.FLARE,
          toId: id,
          flareId: flare.id,
          followeeId: user.id,
          content: flare.blocks.find(({ type }) => type === BlockType.text)
            ?.content,
        })),
      });

    /**
     * If there are images in the flare, we need to upload them to the media service
     * and then create the flare.
     */
    let files: FileWithMeta[] = [];
    if (hadMediaAssociatedWithFlare) {
      const jobData = await this.mediaService.getJobData(flareInput.jobId);
      files = await this.mediaService.uploadToCloud(jobData.files ?? []);
      cleanupFilesAfterUpload();
    }
    const flare = await createFlare(files);
    sendNotifications(flare, followerIds);
    return flare;
  }

  async delete(id: string, user: CurrentUser) {
    const flare = await this.prisma.flare.findUnique({
      where: {
        id,
      },
    });
    if (flare.authorId !== user.id) {
      throw new ForbiddenException();
    }

    const flareUpdated = await this.prisma.flare.update({
      where: {
        id,
      },
      data: {
        deleted: true,
      },
      select: {
        blocks: {
          where: {
            type: BlockType.images,
          },
          select: {
            content: true,
          },
        },
      },
    });

    this.mediaService.deleteMedia(
      (flareUpdated.blocks ?? []).reduce((acc, curr) => {
        const content = curr.content as { name: string }[];
        if (content?.length > 0) {
          return [...acc, ...(content ?? []).map((file) => file.name)];
        }
        return acc;
      }, [])
    );

    return { success: true };
  }

  addComment(input: AddCommentInput, user: CurrentUser) {
    return this.prisma.flare.update({
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
    });
  }

  removeComment(input: RemoveCommentInput, user: CurrentUser) {
    return this.prisma.flare.update({
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
    });
  }

  addLike(input: AddLikeInput, user: CurrentUser) {
    return this.prisma.flare.update({
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
    });
  }

  removeLike(input: RemoveLikeInput, user: CurrentUser) {
    return this.prisma.flare.update({
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
    });
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
}
