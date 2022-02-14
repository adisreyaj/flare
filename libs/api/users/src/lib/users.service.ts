import {
  CreateUserInput,
  GiveKudosInput,
  UpdateUserInput,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, forkJoin, from, map, of, throwError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: {
        bio: true,
        followers: true,
        following: true,
      },
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
          ).pipe(map((result) => !!result.followers.length))
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

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        bio: true,
        followers: true,
        following: true,
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

  update(updateUserInput: UpdateUserInput) {
    const { id, bio, ...user } = updateUserInput;
    return from(
      this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...user,
          ...(bio && {
            bio: {
              update: {
                ...bio,
              },
            },
          }),
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
    return from(
      this.prisma.user.update({
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
      })
    );
  }

  unfollow(userId: string, user: CurrentUser) {
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
}
