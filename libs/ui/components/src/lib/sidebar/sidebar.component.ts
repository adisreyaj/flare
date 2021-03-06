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
import { ProfileImageDefaultDirectiveModal } from '@flare/ui/shared';

@Component({
  selector: 'flare-sidebar',
  template: `
    <div
      class="sm:bottom-unset sm:w-unset fixed bottom-0 z-50 w-full border-t border-slate-200 bg-white px-2 shadow-2xl sm:relative sm:border-none sm:pt-10 sm:shadow-none md:px-6"
    >
      <header
        class="mb-6 hidden items-center justify-center gap-2 sm:flex lg:justify-start lg:px-6"
      >
        <img src="assets/images/flare.svg" alt="Flare" class="h-8 w-8" />
        <p class="hidden text-xl font-bold lg:block">Flare</p>
      </header>
      <nav class="px-4 py-2 sm:px-0 sm:py-0">
        <ul
          class="flex justify-between gap-4 text-lg font-medium text-slate-700 sm:flex-col"
        >
          <li
            routerLink="/"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
          >
            <rmx-icon class="inactive-icon" name="home-2-line"></rmx-icon>
            <rmx-icon class="active-icon" name="home-2-fill"></rmx-icon>
            <p class="hidden lg:block">Home</p>
          </li>
          <li routerLink="/discover" routerLinkActive="active">
            <rmx-icon class="inactive-icon" name="compass-3-line"></rmx-icon>
            <rmx-icon class="active-icon" name="compass-3-fill"></rmx-icon>
            <p class="hidden lg:block">Discover</p>
          </li>
          <li routerLink="/notifications" routerLinkActive="active">
            <rmx-icon
              class="inactive-icon"
              name="notification-4-line"
            ></rmx-icon>
            <rmx-icon class="active-icon" name="notification-4-fill"></rmx-icon>
            <p class="hidden lg:block">Notifications</p>
          </li>
          <li [routerLink]="['/', user?.username]" routerLinkActive="active">
            <rmx-icon class="inactive-icon" name="user-3-line"></rmx-icon>
            <rmx-icon class="active-icon" name="user-3-fill"></rmx-icon>
            <p class="hidden lg:block">Profile</p>
          </li>
          <li routerLink="/bookmarks" routerLinkActive="active">
            <rmx-icon class="inactive-icon" name="bookmark-line"></rmx-icon>
            <rmx-icon class="active-icon" name="bookmark-fill"></rmx-icon>
            <p class="hidden lg:block">Bookmarks</p>
          </li>
        </ul>
      </nav>
      <div class="mt-10 hidden px-2 md:px-0">
        <button
          class="w-full justify-center text-lg"
          zzButton
          variant="primary"
        >
          <div class="flex items-center justify-center">
            <rmx-icon class="icon-sm" name="quill-pen-line"></rmx-icon>
            <p class="ml-2 hidden lg:block">New Flare</p>
          </div>
        </button>
      </div>
    </div>
    <footer
      *ngIf="user"
      [routerLink]="['/', user.username]"
      class=" hidden cursor-pointer gap-2 p-4  hover:bg-slate-100 sm:flex"
    >
      <img
        [src]="user.image"
        [flareDefaultImage]="user.username"
        [alt]="user.firstName"
        class="h-10 w-10 rounded-full"
      />
      <div class="hidden lg:block">
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
        @apply flex cursor-pointer items-center justify-center gap-2 rounded-full py-2 text-slate-900 transition-all duration-200 hover:bg-primary-transparent-10 lg:justify-start lg:px-6;
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
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    RouterModule,
    ProfileImageDefaultDirectiveModal,
    ProfileImageDefaultDirectiveModal,
  ],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class SidebarComponentModule {}
