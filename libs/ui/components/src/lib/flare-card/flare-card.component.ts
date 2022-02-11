import { Component, Input, NgModule } from '@angular/core';
import { ButtonModule, DropdownModule, TooltipModule } from 'zigzag';
import { IconModule } from '@flare/ui/components';
import { BlockType, Flare } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksRendererModule } from '../flare-block-renderers/flare-blocks-renderer.module';
import { FlareService } from '@flare/ui/flare';
import { FlareLikeIconPipeModule } from './flare-like.pipe';

@Component({
  selector: 'flare-card',
  templateUrl: './flare-card.component.html',
  styles: [
    `
      rmx-icon.rmx-icon-heart-2-fill {
        @apply text-primary;
      }
    `,
  ],
})
export class FlareCardComponent {
  blockTypes = BlockType;

  @Input()
  flare!: Flare;

  constructor(private readonly flareService: FlareService) {}

  deleteFlare(flare: Flare) {
    this.flareService.delete(flare.id).subscribe();
  }

  toggleLike(flare: Flare) {
    const isLiked = flare.likes.length > 0;
    const request$ = isLiked
      ? this.flareService.removeLike(flare.id, flare.likes[0].id)
      : this.flareService.like(flare.id);
    request$.subscribe();
  }
}

@NgModule({
  declarations: [FlareCardComponent],
  exports: [FlareCardComponent],
  imports: [
    ButtonModule,
    IconModule,
    TooltipModule,
    CommonModule,
    FlareBlocksRendererModule,
    DropdownModule,
    FlareLikeIconPipeModule,
  ],
})
export class FlareCardModule {}
