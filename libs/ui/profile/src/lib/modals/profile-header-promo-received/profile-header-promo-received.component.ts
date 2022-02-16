import { Component, NgModule } from '@angular/core';
import { Observable } from 'rxjs';
import { HeaderPromo } from '@flare/api-interfaces';
import { HeaderPromoService } from '../../services/header-promo.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'zigzag';
import { MediaUrlPipeModule } from '@flare/ui/shared';

@Component({
  selector: 'flare-profile-header-promo-received',
  template: `
    <div class="">
      <header class="mb-6 p-4">
        <h1 class="text-lg font-medium">Promos Received</h1>
      </header>
      <section class="overflow-y-auto p-6 pt-0" [style.max-height]="'70vh'">
        <ul class="grid grid-cols-1 gap-4 py-2">
          <ng-container *ngFor="let promo of promos$ | async">
            <li
              class="rounded-md border border-slate-200 ring-primary transition-all duration-300 hover:border-primary hover:shadow-xl hover:ring-1"
            >
              <header class="aspect-header" style="max-height: 300px">
                <img
                  [src]="promo.image.name | mediaUrl"
                  alt=""
                  class="h-full w-full rounded-md object-fill"
                />
              </header>
              <div class="p-4">
                <h2 class="text-md font-semibold">{{ promo.title }}</h2>
                <p class="text-slate-500">{{ promo?.description }}</p>
                <div class="mt-2 text-sm text-slate-500">
                  <p>
                    Price Quoted:
                    <span class="font-medium text-slate-800"
                      >{{ promo.price.amount | currency: promo.price.currency }}
                    </span>
                  </p>
                  <p>
                    Sent on
                    <span class="font-medium text-slate-800">{{
                      promo.createdAt | date: 'short'
                    }}</span>
                  </p>
                </div>
              </div>
              <footer
                class="flex justify-between border-t border-slate-200 p-4"
              >
                <div class="flex gap-4">
                  <button zzButton variant="primary" size="sm">
                    Apply as Header
                  </button>
                  <button zzButton size="sm">Reject</button>
                </div>
                <button zzButton variant="link" size="sm">Mark As Spam</button>
              </footer>
            </li>
          </ng-container>
        </ul>
      </section>
    </div>
  `,
})
export class ProfileHeaderPromoReceivedComponent {
  promos$: Observable<HeaderPromo[]>;
  constructor(private readonly headerPromoService: HeaderPromoService) {
    this.promos$ = this.headerPromoService.getPromosReceived();
  }
}

@NgModule({
  declarations: [ProfileHeaderPromoReceivedComponent],
  exports: [ProfileHeaderPromoReceivedComponent],
  imports: [CommonModule, ButtonModule, MediaUrlPipeModule, MediaUrlPipeModule],
})
export class ProfileHeaderPromoReceivedModule {}
