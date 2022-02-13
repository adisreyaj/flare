import { Component } from '@angular/core';
import { UiBookmarkService } from './ui-bookmark.service';
import { Observable } from 'rxjs';
import { Flare } from '@flare/api-interfaces';

@Component({
  selector: 'flare-bookmark',
  template: ` <flare-feeds-header title="Bookmarks">
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
    <ng-container *ngFor="let flare of bookmarkedFlares$ | async">
      <flare-card [flare]="flare"></flare-card>
    </ng-container>`,
})
export class BookmarkComponent {
  bookmarkedFlares$: Observable<Flare[]>;

  constructor(private readonly bookmarkService: UiBookmarkService) {
    this.bookmarkedFlares$ = this.bookmarkService.bookmarkedFlares$;
  }
}
