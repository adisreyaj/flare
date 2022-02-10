import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import { User } from '@flare/api-interfaces';

@Component({
  selector: 'flare-sidebar',
  template: `
    <div class="px-6 pt-10">
      <header class="mb-6 flex items-center gap-2 px-6">
        <img src="assets/images/flare.svg" alt="Flare" class="h-8 w-8" />
        <p class="text-xl font-bold">Flare</p>
      </header>
      <nav>
        <ul class="flex flex-col gap-4 text-lg font-medium text-slate-700">
          <li>
            <rmx-icon name="home-2-line"></rmx-icon>
            Home
          </li>
          <li>
            <rmx-icon name="compass-3-line"></rmx-icon>
            Discover
          </li>
          <li>
            <rmx-icon name="notification-4-line"></rmx-icon>
            Notifications
          </li>
          <li>
            <rmx-icon name="user-3-line"></rmx-icon>
            Profile
          </li>
          <li>
            <rmx-icon name="bookmark-line"></rmx-icon>
            Bookmarks
          </li>
        </ul>
      </nav>
      <div class="mt-10">
        <button class="w-full text-lg" zzButton variant="primary">
          New Flare
        </button>
      </div>
    </div>
    <footer
      *ngIf="user"
      class="flex cursor-pointer gap-2 border-t border-slate-200 p-4 hover:bg-slate-100"
    >
      <img
        [src]="user.image"
        [alt]="user.firstName"
        class="h-10 w-10 rounded-full"
      />
      <div class="">
        <p class="-mb-1 font-semibold">
          {{ user.firstName }} {{ user.lastName }}
        </p>
        <p class="text-sm text-slate-500">@{{ user.username }}</p>
      </div>
    </footer>
  `,
  styles: [
    `
      :host {
        @apply flex h-full w-full flex-col justify-between border-r border-slate-200;
      }

      ul li {
        @apply flex cursor-pointer items-center gap-2 rounded-full px-6 py-2 text-slate-900 transition-all duration-200 hover:bg-primary-transparent-10;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  @Input()
  user: User | null = null;
}

@NgModule({
  imports: [CommonModule, ButtonModule, IconModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarComponentModule {}
