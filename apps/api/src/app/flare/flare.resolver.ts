import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FlareService } from './flare.service';
import {
  AddCommentInput,
  AddLikeInput,
  CreateFlareInput,
  RemoveCommentInput,
  RemoveLikeInput,
} from '@flare/api-interfaces';

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
  create(@Args('input') createFlareInput: CreateFlareInput) {
    return this.flareService.create(createFlareInput);
  }

  @Mutation('deleteFlare')
  delete(@Args('id') id: string) {
    return this.flareService.delete(id);
  }

  @Mutation('addComment')
  addComment(@Args('input') input: AddCommentInput) {
    return this.flareService.addComment(input);
  }

  @Mutation('removeComment')
  removeComment(@Args('input') input: RemoveCommentInput) {
    return this.flareService.removeComment(input);
  }

  @Mutation('addLike')
  addLike(@Args('input') input: AddLikeInput) {
    return this.flareService.addLike(input);
  }

  @Mutation('removeLike')
  removeLike(@Args('input') input: RemoveLikeInput) {
    return this.flareService.removeLike(input);
  }
}
