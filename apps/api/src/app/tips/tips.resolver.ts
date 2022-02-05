import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { TipsService } from './tips.service';
import { TipInput } from '@flare/api-interfaces';

@Resolver('Tip')
export class TipsResolver {
  constructor(private readonly tipsService: TipsService) {}

  @Query('tips')
  getTips() {
    return this.tipsService.getTips();
  }

  @Query('tip')
  getTip(id: string) {
    return this.tipsService.getTip(id);
  }

  @Mutation('tip')
  tip(input: TipInput) {
    return this.tipsService.tip(input);
  }
}
