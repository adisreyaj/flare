import { Component } from '@angular/core';
import { UiBookmarkService } from './ui-bookmark.service';
import { Observable } from 'rxjs';
import { Flare } from '@flare/api-interfaces';
import { FlareCardActions } from '@flare/ui/components';
import { FlareService } from '@flare/ui/flare';

@Component({
  selector: 'flare-bookmark',
  template: `
    <flare-feeds-header title="Bookmarks">
      <button
        [zzDropdownTrigger]="flareMoreOptions"
        placement="bottom-start"
        variant="link"
        zzButton
      >
        <rmx-icon class="icon-xs" name="more-fill"></rmx-icon>
        <zz-dropdown #flareMoreOptions>
          <button class="w-full rounded-md" size="sm" variant="link" zzButton>
            <div class="flex items-center gap-2">
              <p class="text-red-500">Remove All Bookmarks</p>
            </div>
          </button>
        </zz-dropdown>
      </button>
    </flare-feeds-header>
    <ng-container *ngIf="bookmarkedFlares$ | async as bookmarkedFlares">
      <ng-container *ngFor="let flare of bookmarkedFlares">
        <flare-card
          context="BOOKMARK"
          [flare]="flare"
          (action)="handleFlareCardActions($event)"
        ></flare-card>
      </ng-container>
      <ng-container *ngIf="bookmarkedFlares.length === 0">
        <div class="grid place-items-center" style="height: calc(100% - 60px)">
          <div class="flex flex-col items-center">
            <img
              class="h-24 w-24"
              src="assets/images/mailbox.svg"
              alt="No Bookmarks"
            />
            <div class="text-center">
              <p class="text-lg font-semibold">
                Uhoh...You don't have any bookmarks yet.
              </p>
              <p class="text-slate-500">
                Go start bookmarking your favorite flares so you don't loose
                them...
              </p>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
})
export class BookmarkComponent {
  bookmarkedFlares$: Observable<Flare[]>;

  constructor(
    private readonly bookmarkService: UiBookmarkService,
    private readonly flareService: FlareService
  ) {
    this.bookmarkedFlares$ = this.bookmarkService.bookmarkedFlares$;
  }

  handleFlareCardActions($event: { type: FlareCardActions; data: Flare }) {
    const trigger: Record<FlareCardActions, () => void> = {
      LIKE: () => this.like($event.data),
      UNLIKE: () => this.unlike($event.data),
      BOOKMARK: () => this.addBookmark($event.data),
      REMOVE_BOOKMARK: () => this.removeBookmark($event.data),
      DELETE: () => {
        return;
      },
    };

    trigger[$event.type]();
  }

  removeBookmark(flare: Flare) {
    this.bookmarkService.removeBookmark(flare.bookmarks[0].id).subscribe();
  }

  private addBookmark(flare: Flare) {
    this.flareService.bookmark(flare.id).subscribe();
  }

  private like(flare: Flare) {
    this.flareService.like(flare.id).subscribe();
  }

  private unlike(flare: Flare) {
    this.flareService.removeLike(flare.id, flare.likes[0].id).subscribe();
  }
}
