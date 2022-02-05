import { Injectable } from '@nestjs/common';
import { TipInput } from '@flare/api-interfaces';
import { Prisma } from '@prisma/client';
import { isNil } from 'lodash';
import { PrismaService } from '@flare/api/prisma';

@Injectable()
export class TipsService {
  constructor(private readonly prisma: PrismaService) {}

  getTips() {
    return this.prisma.tip.findMany();
  }

  getTip(id: string) {
    return this.prisma.tip.findUnique({
      where: {
        id,
      },
    });
  }

  tip(tip: TipInput) {
    const { user, amount, currency, note, flare } = tip;
    return this.prisma.tip.create({
      data: {
        ...(!isNil(note) ? { note } : {}),
        flareId: flare,
        amount,
        userId: user,
        currency: currency as unknown as Prisma.JsonObject,
        paymentDetails: currency as unknown as Prisma.JsonObject,
        tippedById: '', //TODO: From JWT
      },
    });
  }
}
