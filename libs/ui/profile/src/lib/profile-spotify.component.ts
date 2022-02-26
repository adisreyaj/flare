import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpotifyLastPlayed } from './services/spotify.service';

@Component({
  selector: 'flare-profile-spotify',
  template: ` <div>
    <ul
      class="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4"
      *ngIf="isValid(tracks)"
    >
      <ng-container *ngFor="let track of getTracks(tracks) | slice: 0:4">
        <li
          class="group rounded-md border border-slate-200 transition-all duration-200"
        >
          <header>
            <img
              class="w-full rounded-md"
              [src]="track?.image"
              [alt]="track?.title"
            />
          </header>
          <div class="p-2 text-sm md:text-base">
            <p class="font-semibold line-clamp-1">
              {{ track?.title }}
            </p>
            <p class="text-xs text-slate-500 line-clamp-1 sm:text-sm">
              {{ track?.artist }}
            </p>
          </div>
        </li>
      </ng-container>
    </ul>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSpotifyComponent {
  @Input()
  tracks: SpotifyLastPlayed[] | boolean = [];

  isValid(tracks: SpotifyLastPlayed[] | boolean): boolean {
    return Array.isArray(tracks);
  }

  getTracks(tracks: SpotifyLastPlayed[] | boolean): SpotifyLastPlayed[] {
    return Array.isArray(tracks) ? tracks : [];
  }
}

@NgModule({
  declarations: [ProfileSpotifyComponent],
  imports: [CommonModule],
  exports: [ProfileSpotifyComponent],
})
export class ProfileSpotifyModule {}
