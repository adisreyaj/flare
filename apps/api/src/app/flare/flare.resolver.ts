import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FlareService } from './flare.service';
import { CreateFlareInput, UpdateFlareInput } from '@flare/api-interfaces';

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

  @Mutation('updateFlare')
  update(@Args('input') updateFlareInput: UpdateFlareInput) {
    return this.flareService.update(updateFlareInput);
  }

  @Mutation('deleteFlare')
  delete(@Args('id') id: string) {
    return this.flareService.delete(id);
  }
}
