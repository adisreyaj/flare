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
import { RouterModule } from '@angular/router';

@Component({
  selector: 'flare-sidebar',
  template: `
    <div class="px-2 pt-10 md:px-6">
      <header
        class="mb-6 flex items-center justify-center gap-2 md:justify-start md:px-6"
      >
        <img src="assets/images/flare.svg" alt="Flare" class="h-8 w-8" />
        <p class="hidden text-xl font-bold md:block">Flare</p>
      </header>
      <nav>
        <ul class="flex flex-col gap-4 text-lg font-medium text-slate-700">
          <li
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <rmx-icon class="inactive-icon" name="home-2-line"></rmx-icon>
            <rmx-icon class="active-icon" name="home-2-fill"></rmx-icon>
            <p class="hidden md:block">Home</p>
          </li>
          <li routerLink="/discover" routerLinkActive="active">
            <rmx-icon class="inactive-icon" name="compass-3-line"></rmx-icon>
            <rmx-icon class="active-icon" name="compass-3-fill"></rmx-icon>
            <p class="hidden md:block">Discover</p>
          </li>
          <li routerLink="/notifications" routerLinkActive="active">
            <rmx-icon
              class="inactive-icon"
              name="notification-4-line"
            ></rmx-icon>
            <rmx-icon class="active-icon" name="notification-4-fill"></rmx-icon>
            <p class="hidden md:block">Notifications</p>
          </li>
          <li [routerLink]="['/', user?.username]" routerLinkActive="active">
            <rmx-icon class="inactive-icon" name="user-3-line"></rmx-icon>
            <rmx-icon class="active-icon" name="user-3-fill"></rmx-icon>
            <p class="hidden md:block">Profile</p>
          </li>
          <li routerLink="/bookmarks" routerLinkActive="active">
            <rmx-icon class="inactive-icon" name="bookmark-line"></rmx-icon>
            <rmx-icon class="active-icon" name="bookmark-fill"></rmx-icon>
            <p class="hidden md:block">Bookmarks</p>
          </li>
        </ul>
      </nav>
      <div class="mt-10 px-2 md:px-0">
        <button
          class="w-full justify-center text-lg"
          zzButton
          variant="primary"
        >
          <div class="flex items-center justify-center">
            <rmx-icon class="icon-sm" name="quill-pen-line"></rmx-icon>
            <p class="ml-2 hidden md:block">New Flare</p>
          </div>
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
      <div class="hidden md:block">
        <p class="-mb-1 font-semibold">
          {{ user.firstName }} {{ user.lastName }}
        </p>
        <p class="text-sm text-slate-500">@{{ user.username }}</p>
      </div>
    </footer>
  `,
  styles: [
    //language=SCSS
    `
      :host {
        @apply sticky top-0 flex h-screen w-full flex-col justify-between;
      }

      ul li {
        @apply flex cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-slate-900 transition-all duration-200 hover:bg-primary-transparent-10 md:justify-start md:px-6;
        .inactive-icon {
          display: block;
        }
        .active-icon {
          @apply text-primary;
          display: none;
        }
        &.active {
          @apply text-primary;
          .inactive-icon {
            display: none;
          }
          .active-icon {
            display: block;
          }
        }
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
  imports: [CommonModule, ButtonModule, IconModule, RouterModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarComponentModule {}
