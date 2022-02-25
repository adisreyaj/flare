import { Component, Input, NgModule } from '@angular/core';
import { Kudos } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'flare-profile-kudos',
  template: ` <ul
    class="flex w-full touch-pan-x snap-x snap-always gap-2 overflow-auto"
  >
    <ng-container *ngFor="let item of kudos | slice: 0:5">
      <li
        class="w-full flex-1  snap-start rounded-lg border border-slate-200 bg-white p-2"
        style="min-width: 300px"
      >
        <div>
          <p
            class="text-sm font-normal leading-normal text-slate-500 line-clamp-3"
          >
            {{ item.content.text }}
          </p>
        </div>
        <footer class="mt-4 flex items-center gap-2">
          <img
            class="h-10 w-10 rounded-full object-cover object-center"
            [src]="item.kudosBy.image"
            alt="photo"
          />
          <div>
            <p class="text-sm font-medium">{{ item.kudosBy.firstName }}</p>
            <p class="text-xs text-primary">@{{ item.kudosBy.username }}</p>
          </div>
        </footer>
      </li>
    </ng-container>
  </ul>`,
})
export class ProfileKudosComponent {
  @Input()
  kudos: Kudos[] | null = [];
}

@NgModule({
  declarations: [ProfileKudosComponent],
  imports: [CommonModule],
  exports: [ProfileKudosComponent],
})
export class ProfileKudosModule {}
