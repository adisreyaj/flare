import { CreateUserInput, UpdateUserInput } from '@flare/api-interfaces';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, from, throwError } from 'rxjs';
import { PrismaService } from '@flare/api/prisma';

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

  findOne(id: string) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        bio: true,
        followers: true,
        following: true,
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
}
