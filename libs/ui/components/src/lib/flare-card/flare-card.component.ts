import {
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { ButtonModule, DropdownModule, TooltipModule } from 'zigzag';
import { IconModule } from '@flare/ui/components';
import { BlockType, Flare, User } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksRendererModule } from '../flare-block-renderers/flare-blocks-renderer.module';
import { FlareLikeIconPipeModule } from './flare-like.pipe';
import { FlareBookmarkIconPipeModule } from './flare-bookmark.pipe';
import { RouterModule } from '@angular/router';
import { ProfileImageDefaultDirectiveModal } from '../../../../shared/src/directives/profile-image-default.directive';
import { CURRENT_USER } from '@flare/ui/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'flare-card',
  templateUrl: './flare-card.component.html',
  styles: [
    //language=SCSS
    `
      rmx-icon {
        &.rmx-icon-heart-2-fill,
        &.rmx-icon-bookmark-fill {
          @apply text-primary;
        }
      }
    `,
  ],
})
export class FlareCardComponent {
  blockTypes = BlockType;

  @Input()
  flare!: Flare;

  @Input()
  context: FlareCardContext = 'FEED';

  @Output()
  action = new EventEmitter<{ type: FlareCardActions; data: Flare }>();

  constructor(@Inject(CURRENT_USER) public readonly user$: Observable<User>) {}
  deleteFlare(flare: Flare) {
    this.action.emit({ type: 'DELETE', data: flare });
  }

  toggleLike(flare: Flare) {
    const isLiked = flare.likes.length > 0;
    this.action.emit({
      type: isLiked ? 'UNLIKE' : 'LIKE',
      data: flare,
    });
  }

  toggleBookmark(flare: Flare) {
    const isBookmarked = flare.bookmarks.length > 0;
    this.action.emit({
      type: isBookmarked ? 'REMOVE_BOOKMARK' : 'BOOKMARK',
      data: flare,
    });
  }

  removeBookmark(flare: Flare) {
    this.action.emit({ type: 'REMOVE_BOOKMARK', data: flare });
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
    FlareBookmarkIconPipeModule,
    RouterModule,
    ProfileImageDefaultDirectiveModal,
  ],
})
export class FlareCardModule {}

export type FlareCardContext = 'FEED' | 'BOOKMARK' | 'EXPLORE';
export type FlareCardActions =
  | 'BOOKMARK'
  | 'REMOVE_BOOKMARK'
  | 'LIKE'
  | 'UNLIKE'
  | 'DELETE';
