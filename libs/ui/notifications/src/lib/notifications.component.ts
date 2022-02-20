import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule, DropdownModule } from 'zigzag';
import { FlareFeedsHeaderModule, IconModule } from '@flare/ui/components';
import { Observable } from 'rxjs';
import { Notification } from '@flare/api-interfaces';
import { UiNotificationsService } from './services/notifications.service';

@Component({
  selector: 'flare-notifications',
  template: ` <flare-feeds-header title="Notifications">
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
    <ng-container *ngIf="notifications$ | async as notifications">
      <ng-container *ngFor="let notification of notifications">
        <p>{{ notification.type }}</p>
      </ng-container>
      <ng-container *ngIf="notifications.length === 0">
        <div class="grid place-items-center" style="height: calc(100% - 60px)">
          <div class="flex flex-col items-center">
            <img
              class="h-24 w-24"
              src="assets/images/bell.svg"
              alt="No Bookmarks"
            />
            <div class="text-center">
              <p class="text-lg font-semibold">No Notifications!</p>
              <p class="text-slate-500">
                Don't get too anxious, we'll send it right away <br />when we
                have the first one ready for you...
              </p>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>`,
})
export class NotificationsComponent {
  notifications$: Observable<Notification[]>;

  constructor(private readonly notificationsService: UiNotificationsService) {
    this.notifications$ = this.notificationsService.getLatestNotifications();
  }
}

@NgModule({
  declarations: [NotificationsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: NotificationsComponent }]),
    DropdownModule,
    ButtonModule,
    FlareFeedsHeaderModule,
    IconModule,
  ],
  exports: [NotificationsComponent],
})
export class UiNotificationsModule {}
