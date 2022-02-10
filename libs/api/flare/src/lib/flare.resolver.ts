import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FlareService } from './flare.service';
import {
  AddCommentInput,
  AddLikeInput,
  CreateFlareInput,
  RemoveCommentInput,
  RemoveLikeInput,
} from '@flare/api-interfaces';
import { CurrentUser } from '@flare/api/shared';

@Resolver('Flare')
export class FlaresResolver {
  constructor(private readonly flareService: FlareService) {}

  @Query('flare')
  findOne(@Args('id') id: string) {
    return this.flareService.findOne(id);
  }

  @Query('flares')
  findAll() {
    return this.flareService.findAll();
  }

  @Mutation('createFlare')
  create(
    @Args('input') createFlareInput: CreateFlareInput,
    @CurrentUser() user: CurrentUser
  ) {
    return this.flareService.create(createFlareInput, user);
  }

  @Mutation('deleteFlare')
  delete(@Args('id') id: string) {
    return this.flareService.delete(id);
  }

  @Mutation('addComment')
  addComment(
    @Args('input') input: AddCommentInput,
    @CurrentUser() user: CurrentUser
  ) {
    return this.flareService.addComment(input, user);
  }

  @Mutation('removeComment')
  removeComment(@Args('input') input: RemoveCommentInput) {
    return this.flareService.removeComment(input);
  }

  @Mutation('addLike')
  addLike(
    @Args('input') input: AddLikeInput,
    @CurrentUser() user: CurrentUser
  ) {
    return this.flareService.addLike(input, user);
  }

  @Mutation('removeLike')
  removeLike(@Args('input') input: RemoveLikeInput) {
    return this.flareService.removeLike(input);
  }
}
