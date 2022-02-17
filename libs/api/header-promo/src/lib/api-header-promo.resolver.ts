import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ApiHeaderPromoService } from '@flare/api/header-promo';
import {
  HeaderPromoInput,
  HeaderPromoUpdateInput,
} from '@flare/api-interfaces';
import { CurrentUser } from '@flare/api/shared';

@Resolver('HeaderPromo')
export class HeaderPromoResolver {
  constructor(private readonly headerPromoService: ApiHeaderPromoService) {}

  @Query('allHeaderPromos')
  allHeaderPromos(@CurrentUser() user: CurrentUser) {
    return this.headerPromoService.getAll(user);
  }

  @Query('headerPromoById')
  headerPromoById(@Args('id') id: string, @CurrentUser() user: CurrentUser) {
    return this.headerPromoService.getById(id, user);
  }

  @Mutation('createHeaderPromo')
  createHeaderPromo(
    @Args('input') input: HeaderPromoInput,
    @Args('jobId') jobId: string,
    @CurrentUser() user: CurrentUser
  ) {
    return this.headerPromoService.create(input, jobId, user);
  }

  @Mutation('updateHeaderPromo')
  updateHeaderPromo(
    @Args('id') id: string,
    @Args('input') input: HeaderPromoUpdateInput,
    @CurrentUser() user: CurrentUser
  ) {
    return this.headerPromoService.update(id, input, user);
  }

  @Mutation('deleteHeaderPromo')
  deleteHeaderPromo(@Args('id') id: string, @CurrentUser() user: CurrentUser) {
    return this.headerPromoService.delete(id, user);
  }

  @Mutation('applyHeaderPromo')
  applyHeaderPromo(@Args('id') id: string, @CurrentUser() user: CurrentUser) {
    return this.headerPromoService.applyHeaderPromo(id, user);
  }
}
