import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@flare/api/prisma';
import { NotificationInput } from '@flare/api-interfaces';
import { CurrentUser } from '@flare/api/shared';

@Injectable()
export class ApiNotificationsService {
  logger = new Logger(ApiNotificationsService.name);
  constructor(private prisma: PrismaService) {}

  create(input: NotificationInput) {
    return this.prisma.notification.create({
      data: {
        flareId: input.flare,
        content: input.content,
        type: input.type,
        toId: input.to,
        followeeId: input.followee,
        commentId: input.comment,
      },
    });
  }

  findAll(user: CurrentUser) {
    this.logger.verbose(`Getting notifications for user ${user.id}`);
    return this.prisma.notification.findMany({
      where: {
        toId: user.id,
      },
      include: {
        to: true,
        followee: true,
        flare: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
