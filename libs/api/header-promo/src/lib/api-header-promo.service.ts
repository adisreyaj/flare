import {
  HeaderPromoInput,
  HeaderPromoUpdateInput,
  PromoState,
} from '@flare/api-interfaces';
import { ApiMediaService } from '@flare/api/media';
import { PrismaService } from '@flare/api/prisma';
import { CurrentUser } from '@flare/api/shared';
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { isEmpty, isNil } from 'lodash';
import { throwError } from 'rxjs';

@Injectable()
export class ApiHeaderPromoService {
  private readonly logger = new Logger(ApiHeaderPromoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly mediaService: ApiMediaService
  ) {}

  getAll(user: CurrentUser) {
    return this.prisma.headerPromo.findMany({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
        sponsor: true,
      },
    });
  }

  getById(id: string, user: CurrentUser) {
    return this.prisma.headerPromo.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        user: true,
        sponsor: true,
      },
    });
  }

  async create(input: HeaderPromoInput, jobId: string, user: CurrentUser) {
    if (isNil(jobId)) {
      throw new BadRequestException('Media is required.');
    }

    const createHeaderPromo = (image) =>
      this.prisma.headerPromo.create({
        data: {
          description: input.description,
          title: input.title,
          price: input.price,
          userId: input.userId,
          sponsorId: user.id,
          state: PromoState.PENDING,
          image: {
            name: image.filename,
            type: image.mimetype,
            size: image.size,
          },
        },
      });

    const jobData = await this.mediaService.getJobData(jobId);
    const files = await this.mediaService.uploadToCloud(jobData.files);
    if (isEmpty(files)) {
      throw new BadRequestException('No files uploaded.');
    }
    this.mediaService.runJobImmediately(jobId);
    return createHeaderPromo(files[0]);
  }

  update(id: string, input: HeaderPromoUpdateInput, user: CurrentUser) {
    return this.prisma.headerPromo.updateMany({
      where: {
        id,
        userId: user.id,
      },
      data: input,
    });
  }

  delete(id: string, user: CurrentUser) {
    return this.prisma.headerPromo.deleteMany({
      where: {
        id,
        userId: user.id,
      },
    });
  }

  async applyHeaderPromo(promoId: string, user: CurrentUser) {
    const promo = await this.prisma.headerPromo.findUnique({
      where: {
        id: promoId,
      },
      select: {
        userId: true,
        state: true,
        image: true,
      },
    });

    const hasAccess = promo.userId === user.id;
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this promo.');
    }
    const isPromoRejected = promo.state === PromoState.REJECTED;
    if (isPromoRejected) {
      return throwError(
        () => new BadRequestException('Promo is not available.')
      );
    }
    const updatePromoStatePromise = (promo) =>
      this.prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          preferences: {
            update: {
              header: {
                type: 'PROMO',
                image: promo.image,
              },
            },
          },
        },
      });

    const updateUserPreferencePromise = this.prisma.headerPromo.update({
      where: {
        id: promoId,
      },
      data: {
        state: PromoState.ACTIVE,
      },
      select: {
        image: true,
        state: true,
      },
    });

    await Promise.all([
      updatePromoStatePromise(promo),
      updateUserPreferencePromise,
    ]);

    return { success: true };
  }
}
