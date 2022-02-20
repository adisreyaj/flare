import {
  CreateUserInput,
  GiveKudosInput,
  NotificationType,
  UpdateHeaderImageInput,
  UpdateUserInput,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser, mapToSuccess } from '@flare/api/shared';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  catchError,
  forkJoin,
  from,
  map,
  of,
  OperatorFunction,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { isEmpty, isNil } from 'lodash';
import { ApiNotificationsService } from '../../../notifications/src/lib/api-notifications.service';
import { ApiMediaService } from '@flare/api/media';
import { FileWithMeta } from '../../../media/src/lib/api-media.interface';

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
      take: 10,
    });
  }

  findByUsername(username: string, currentUser: CurrentUser) {
    const isFollowingTheUser$ =
      username !== currentUser.username
        ? from(
            this.prisma.user.findUnique({
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
            })
          ).pipe(map((result) => result?.followers?.length > 0 ?? false))
        : of(false);

    const userDetails$ = from(
      this.prisma.user.findUnique({
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
      })
    );

    return forkJoin([userDetails$, isFollowingTheUser$]).pipe(
      map(([user, isFollowing]) => {
        return {
          ...user,
          isFollowing,
        };
      })
    );
  }

  isUsernameAvailable(username: string) {
    return from(
      this.prisma.user.count({
        where: {
          username,
        },
      })
    ).pipe(map((count) => ({ available: count === 0 })));
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
    return from(
      this.prisma.user.create({
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
      })
    ).pipe(
      catchError((err) => {
        console.log(err);
        return throwError(() => new InternalServerErrorException());
      })
    );
  }

  update(
    updateUserInput: UpdateUserInput,
    currentUser: CurrentUser,
    onBoardingState: string | null = null
  ) {
    const { bio, preferences, ...user } = updateUserInput;
    console.log();
    return from(
      this.prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          ...user,
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
      this.prisma.user.delete({
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

  follow(userId: string, user: CurrentUser) {
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

    return from(
      this.prisma.$transaction([creatNotificationPromise, updateUserPromise])
    ).pipe(map(([, user]) => user));
  }

  unfollow(userId: string, user: CurrentUser) {
    if (user.id === userId) {
      return throwError(() => new BadRequestException());
    }
    return from(
      this.prisma.user.update({
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
      })
    );
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

  completeOnboarding(user: CurrentUser) {
    this.logger.log('completeOnboarding', user);
    return from(
      this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
        select: {
          id: true,
          isOnboarded: true,
          onboardingState: true,
          _count: {
            select: {
              following: true,
            },
          },
        },
      })
    ).pipe(
      switchMap((user) => {
        if (user.isOnboarded) {
          return throwError(() => new BadRequestException('Already onboarded'));
        }
        return this.prisma.user.update({
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
      }),
      map(() => ({ success: true }))
    );
  }

  updateHeaderImage(input: UpdateHeaderImageInput, user: CurrentUser) {
    if (isNil(input.jobId)) {
      return throwError(() => new BadRequestException('Media not found'));
    }

    const updateHeader$ = (files: FileWithMeta[] = []) =>
      from(
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
        })
      );
    return from(this.mediaService.getJobData(input.jobId)).pipe(
      this.handleFileUploadsIfJobExists(),
      switchMap((files) => updateHeader$(files)),
      mapToSuccess(),
      tap(() => {
        this.mediaService.runJobImmediately(input.jobId);
      })
    );
  }

  private handleFileUploadsIfJobExists(): OperatorFunction<
    { files: FileWithMeta[] },
    FileWithMeta[]
  > {
    return (source) => {
      return source.pipe(
        switchMap((data) => {
          if (isEmpty(data)) {
            this.logger.error('Job Data not found');
            return throwError(
              () => new InternalServerErrorException('Media upload error')
            );
          } else {
            return from(this.mediaService.uploadToCloud(data.files));
          }
        }),
        switchMap((data: FileWithMeta[]) => {
          if (isNil(data)) {
            return throwError(
              () => new InternalServerErrorException('Media upload error')
            );
          } else {
            return of(data);
          }
        })
      );
    };
  }
}
