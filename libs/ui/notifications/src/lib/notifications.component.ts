import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule, DropdownModule } from 'zigzag';
import { FlareFeedsHeaderModule, IconModule } from '@flare/ui/components';
import { Observable } from 'rxjs';
import { Notification } from '@flare/api-interfaces';
import { UiNotificationsService } from './services/notifications.service';
import { NotificationCardModule } from './notification-card.component';

@Component({
  selector: 'flare-notifications',
  template: ` <flare-feeds-header title="Notifications"> </flare-feeds-header>
    <ng-container *ngIf="notifications$ | async as notifications">
      <ng-container *ngFor="let notification of notifications">
        <flare-notification-card
          [notification]="notification"
        ></flare-notification-card>
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
                Looks like you don't have any notifications at the moment.<br />
                Come back later to see if you got one!
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
    this.notifications$ =
      this.notificationsService.getLatestNotifications(true);
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
    NotificationCardModule,
  ],
  exports: [NotificationsComponent],
})
export class UiNotificationsModule {}
