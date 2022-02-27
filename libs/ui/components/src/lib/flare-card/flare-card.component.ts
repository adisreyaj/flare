import {
  Component,
  EventEmitter,
  Inject,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import {
  ButtonModule,
  DropdownModule,
  FormInputModule,
  TooltipModule,
} from 'zigzag';
import { IconModule } from '@flare/ui/components';
import { BlockType, Flare, User } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksRendererModule } from '../flare-block-renderers/flare-blocks-renderer.module';
import { FlareLikeIconPipeModule } from './flare-like.pipe';
import { FlareBookmarkIconPipeModule } from './flare-bookmark.pipe';
import { Router, RouterModule } from '@angular/router';
import { CURRENT_USER } from '@flare/ui/auth';
import { Observable } from 'rxjs';
import { ProfileImageDefaultDirectiveModal } from '@flare/ui/shared';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

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
  action = new EventEmitter<FlareCardEventData>();

  commentControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(255),
  ]);
  constructor(
    @Inject(CURRENT_USER) public readonly user$: Observable<User>,
    private readonly router: Router
  ) {}
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
    if (this.commentControl.valid) {
      this.action.emit({ type: 'REMOVE_BOOKMARK', data: flare });
    }
  }

  addComment(flare: Flare) {
    this.action.emit({
      type: 'ADD_COMMENT',
      data: { flare, comment: this.commentControl.value },
    });
    this.commentControl.reset();
  }

  routeToFlareDetail(id: string) {
    if (this.context !== 'FLARE_DETAIL') this.router.navigate(['/flare', id]);
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
    ClipboardModule,
    FormInputModule,
    ReactiveFormsModule,
  ],
})
export class FlareCardModule {}

export type FlareCardContext = 'FEED' | 'BOOKMARK' | 'EXPLORE' | 'FLARE_DETAIL';
export type FlareCardActions =
  | 'BOOKMARK'
  | 'REMOVE_BOOKMARK'
  | 'LIKE'
  | 'UNLIKE'
  | 'ADD_COMMENT'
  | 'REMOVE_COMMENT'
  | 'DELETE';

export interface FlareCardEventDataBase<TData = unknown> {
  data: TData;
  type: FlareCardActions;
}

export interface FlareEventsData extends FlareCardEventDataBase {
  data: Flare;
  type: 'BOOKMARK' | 'REMOVE_BOOKMARK' | 'LIKE' | 'UNLIKE' | 'DELETE';
}

export interface FlareCommentEventsData extends FlareCardEventDataBase {
  data: {
    flare: Flare;
    comment: string;
    commentId?: string;
  };
  type: 'ADD_COMMENT' | 'REMOVE_COMMENT';
}

export type FlareCardEventData = FlareEventsData | FlareCommentEventsData;
