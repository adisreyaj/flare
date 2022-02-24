import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  FlareCardModule,
  FlareFeedsHeaderModule,
  IconModule,
} from '@flare/ui/components';
import { ButtonModule, DropdownModule } from 'zigzag';
import { Observable } from 'rxjs';
import { Flare, User } from '@flare/api-interfaces';
import { DiscoverService } from './services/discover.service';

@Component({
  selector: 'flare-discover',
  template: `
    <flare-feeds-header title="Discover">
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
    <ng-container *ngIf="topUsers$ | async as topUsers">
      <ul class="overflow-x-auto border-b border-slate-200 py-4">
        <li
          class="flex cursor-pointer flex-col items-center rounded-md bg-white p-2"
          *ngFor="let user of topUsers"
          [routerLink]="['/', user.username]"
          style="width:100px;"
        >
          <img
            class="h-12 w-12 rounded-full"
            [src]="user.image"
            [alt]="user.firstName"
          />
          <div class="mt-2 text-center">
            <p class="font-semibold">{{ user.firstName }}</p>
          </div>
        </li>
      </ul>
    </ng-container>
    <ng-container *ngIf="popularFlares$ | async as popularFlares">
      <ng-container *ngFor="let flare of popularFlares">
        <flare-card context="EXPLORE" [flare]="flare"></flare-card>
      </ng-container>
      <ng-container *ngIf="popularFlares.length === 0">
        <div class="grid place-items-center" style="height: calc(100% - 60px)">
          <div class="flex flex-col items-center">
            <img
              class="h-24 w-24"
              src="assets/images/fire.svg"
              alt="No Bookmarks"
            />
            <div class="text-center">
              <p class="text-lg font-semibold">No trending flares found.</p>
              <p class="text-slate-500">
                We'll find some great flares for you in some time...
              </p>
            </div>
          </div>
        </div>
      </ng-container>
    </ng-container>
  `,
})
export class DiscoverComponent {
  popularFlares$: Observable<Flare[]>;
  topUsers$: Observable<User[]>;
  constructor(private readonly exploreService: DiscoverService) {
    this.popularFlares$ = this.exploreService.getAllBookmarkedFlares();
    this.topUsers$ = this.exploreService.getTopUsers();
  }
}

@NgModule({
  declarations: [DiscoverComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: DiscoverComponent }]),
    FlareFeedsHeaderModule,
    DropdownModule,
    IconModule,
    FlareCardModule,
    ButtonModule,
  ],
  exports: [DiscoverComponent],
})
export class DiscoverModule {}
