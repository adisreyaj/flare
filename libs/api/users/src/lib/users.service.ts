import {
  CreateUserInput,
  GiveKudosInput,
  UpdateUserInput,
} from '@flare/api-interfaces';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, from, throwError } from 'rxjs';

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

  findByUsername(username: string) {
    return this.prisma.user.findUnique({
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
    });
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

  follow(userId: string) {
    return from(
      this.prisma.user.update({
        where: {
          id: userId,
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

  unfollow(userId: string) {
    return from(
      this.prisma.user.update({
        where: {
          id: userId,
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
    console.log(input, user);
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
