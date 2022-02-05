import { SponsorInput } from '@flare/api-interfaces';
import { Prisma } from '@prisma/client';
import { from } from 'rxjs';
import { PrismaService } from '@flare/api/prisma';

export class SponsorsService {
  constructor(private readonly prisma: PrismaService) {}

  getAllSponsors(userId: string) {
    return from(
      this.prisma.sponsor.findMany({
        where: {
          userId,
        },
      })
    );
  }

  getMySponsors() {
    return this.getAllSponsors('');
  }

  sponsor(sponsor: SponsorInput) {
    const { user, amount, currency, paymentDetails, type } = sponsor;
    return from(
      this.prisma.sponsor.create({
        data: {
          amount,
          currency: currency as unknown as Prisma.JsonObject,
          paymentDetails: paymentDetails as unknown as Prisma.JsonObject,
          type,
          userId: user,
          sponsoredById: '', //TODO: from JWT
        },
      })
    );
  }

  cancelSponsorship(id: string) {
    return from(this.prisma.sponsor.delete({ where: { id } }));
  }
}
