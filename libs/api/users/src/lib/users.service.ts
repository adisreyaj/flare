import {
  CreateUserInput,
  GiveKudosInput,
  NotificationType,
  UpdateHeaderImageInput,
  UpdateUserInput,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { throwError } from 'rxjs';
import { isEmpty, isNil } from 'lodash';
import { ApiNotificationsService } from '@flare/api/notifications';
import { ApiMediaService, FileWithMeta } from '@flare/api/media';
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

@Injectable()
export class UsersService {
  logger = new Logger(UsersService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: ApiMediaService,
    private readonly notificationsService: ApiNotificationsService
  ) {}

  findAll() {
    return this.prisma.user.findMany({
      include: {
        bio: true,
        followers: true,
        following: true,
      },
    });
  }

  getTopUsers(currentUser: CurrentUser) {
    return this.prisma.user.findMany({
      where: {
        id: {
          not: currentUser.id,
        },
      },
      orderBy: {
        followers: {
          _count: 'desc',
        },
      },
      include: {
        followers: {
          select: {
            id: true,
          },
          where: {
            id: currentUser.id,
          },
        },
      },
      take: 100,
    });
  }

  async findByUsername(username: string, currentUser: CurrentUser) {
    const followersOfCurrentUser = this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        followers: {
          where: {
            id: {
              equals: currentUser.id,
            },
          },
        },
      },
    });
    const userDetailsPromise = this.prisma.user.findUnique({
      where: {
        username: username,
      },
      include: {
        bio: true,
        followers: true,
        following: true,
        preferences: true,
        kudos: {
          include: {
            kudosBy: true,
          },
        },
        kudosGiven: true,
        _count: {
          select: {
            following: true,
            followers: true,
          },
        },
      },
    });
    try {
      const [user, followers] = await Promise.all([
        userDetailsPromise,
        followersOfCurrentUser,
      ]);
      const isFollowingTheRequestedUser = followers.followers.length > 0;
      const { email, password, ...rest } = user;
      return {
        ...rest,
        isFollowing: isFollowingTheRequestedUser,
      };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async isUsernameAvailable(username: string) {
    try {
      const user = await this.prisma.user.count({
        where: {
          username,
        },
      });

      return { available: user === 0 };
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        bio: true,
        followers: true,
        following: true,
        preferences: true,
        kudos: {
          include: {
            kudosBy: true,
          },
        },
        kudosGiven: true,
        _count: {
          select: {
            following: true,
            followers: true,
            kudos: true,
            bookmarks: true,
          },
        },
      },
    });
  }

  // TODO: Hash password
  create(user: CreateUserInput) {
    return this.prisma.user.create({
      data: {
        ...user,
        username: user.email,
        preferences: {
          create: {
            blogs: {
              enabled: false,
            },
            kudos: {
              enabled: false,
            },
            header: {
              type: 'DEFAULT',
              image: {
                name: '/assets/images/header.jpg',
              },
            },
          },
        },
        onboardingState: {
          state: 'SIGNED_UP',
        },
        isOnboarded: false,
        bio: {
          create: user.bio ?? {
            description: '',
            devto: '',
            facebook: '',
            github: '',
            hashnode: '',
            linkedin: '',
            twitter: '',
          },
        },
      },
    });
  }

  async update(
    updateUserInput: UpdateUserInput,
    currentUser: CurrentUser,
    onBoardingState: string | null = null
  ) {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors], // colors can be omitted here as not used
      length: 2,
      separator: '_',
    });
    const { bio, preferences, password, username, ...user } = updateUserInput;
    const needToUpdateUsername =
      Object.keys(updateUserInput).findIndex((key) => key === 'username') !==
      -1;
    return this.prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        ...user,
        ...(needToUpdateUsername && isNil(username) && { username: shortName }),
        ...(!isNil(onBoardingState) && {
          onboardingState: { state: onBoardingState },
        }),
        ...(bio
          ? {
              bio: {
                update: {
                  ...bio,
                },
              },
            }
          : {}),
        ...(preferences
          ? {
              preferences: {
                update: {
                  ...preferences,
                },
              },
            }
          : {}),
      },
      include: {
        bio: true,
        followers: true,
        following: true,
      },
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: {
        id,
      },
    });
  }

  async follow(userId: string, user: CurrentUser) {
    if (user.id === userId) {
      return throwError(() => new BadRequestException());
    }
    const creatNotificationPromise = this.notificationsService.create({
      type: NotificationType.FOLLOW,
      to: userId,
      followee: user.id,
      read: false,
    });
    const updateUserPromise = this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        following: {
          connect: {
            id: userId,
          },
        },
      },
    });

    const [, userUpdated] = await this.prisma.$transaction([
      creatNotificationPromise,
      updateUserPromise,
    ]);
    return userUpdated;
  }

  async unfollow(userId: string, user: CurrentUser) {
    if (user.id === userId) {
      return throwError(() => new BadRequestException());
    }
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        following: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  giveKudos(input: GiveKudosInput, user: CurrentUser) {
    return this.prisma.kudos.create({
      data: {
        kudosById: user.id,
        content: input.content,
        userId: input.userId,
      },
    });
  }

  removeKudos(id: string, user: CurrentUser) {
    return this.prisma.kudos.deleteMany({
      where: {
        id,
        kudosById: user.id,
      },
    });
  }

  async completeOnboarding(user: CurrentUser) {
    this.logger.log('completeOnboarding', user);

    await this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isOnboarded: true,
        onboardingState: {
          state: 'ONBOARDING_COMPLETE',
        },
      },
    });
    return { success: true };
  }

  async updateHeaderImage(input: UpdateHeaderImageInput, user: CurrentUser) {
    if (isNil(input.jobId)) {
      return throwError(() => new BadRequestException('Media not found'));
    }

    const updateHeaderPromise = (files: FileWithMeta[] = []) =>
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          preferences: {
            update: {
              id: input.preferenceId,
              header: {
                image: {
                  name: files[0].filename,
                  type: files[0].mimetype,
                  size: files[0].size,
                },
              },
            },
          },
        },
      });

    const jobData = await this.mediaService.getJobData(input.jobId);
    if (isEmpty(jobData)) {
      throw new BadRequestException('Media not found');
    }
    const uploadedFiles = await this.mediaService.uploadToCloud(jobData.files);
    if (isEmpty(jobData)) {
      throw new InternalServerErrorException(
        'Failed to upload the header image'
      );
    }
    await updateHeaderPromise(uploadedFiles);
    this.mediaService.runJobImmediately(input.jobId);
    return { success: true };
  }
}
