import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SponsorsService } from './sponsors.service';
import { SponsorInput } from '@flare/api-interfaces';

@Resolver('Sponsor')
export class SponsorsResolver {
  constructor(private readonly sponsorsService: SponsorsService) {}

  @Query('sponsors')
  getAllSponsors() {
    return this.sponsorsService.getAllSponsors('');
  }

  @Query('mySponsors')
  getMySponsors() {
    return this.sponsorsService.getMySponsors();
  }

  @Mutation('sponsor')
  sponsor(@Args('input') input: SponsorInput) {
    return this.sponsorsService.sponsor(input);
  }

  @Mutation('cancelSponsorship')
  cancelSponsorship(@Args('id') id: string) {
    return this.sponsorsService.cancelSponsorship(id);
  }
}
