import { Component, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Notification } from '@flare/api-interfaces';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';
import { RouterModule } from '@angular/router';
import { ProfileImageDefaultDirectiveModal } from '../../../shared/src/directives/profile-image-default.directive';

@Component({
  selector: 'flare-notification-card',
  template: `
    <article
      class="relative border-b border-slate-200 p-4"
      *ngIf="notification"
    >
      <ng-container [ngSwitch]="notification.type">
        <ng-container *ngSwitchCase="'FOLLOW'">
          <div class="flex items-center gap-2">
            <img
              [flareDefaultImage]="notification?.followee?.username"
              class="h-12 w-12 rounded-full"
              [src]="notification?.followee?.image"
              [alt]="notification?.followee?.firstName"
            />
            <div class="flex-1">
              <p class="text-sm font-medium leading-5 text-slate-700">
                <span
                  class="cursor-pointer font-semibold text-primary"
                  [routerLink]="['/', notification?.followee?.username]"
                >
                  {{ notification?.followee?.firstName }}
                  {{ notification?.followee?.lastName }}
                </span>
                started following you.
              </p>
              <p class="mt-1 font-sans text-xs text-slate-500">
                {{ notification.createdAt | date: 'short' }}
              </p>
            </div>
          </div>
        </ng-container>
      </ng-container>
    </article>
  `,
})
export class NotificationCardComponent {
  @Input()
  notification!: Nullable<Notification>;
}

@NgModule({
  declarations: [NotificationCardComponent],
  exports: [NotificationCardComponent],
  imports: [CommonModule, RouterModule, ProfileImageDefaultDirectiveModal],
})
export class NotificationCardModule {}
