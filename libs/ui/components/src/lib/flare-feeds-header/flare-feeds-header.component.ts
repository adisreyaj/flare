import { Component, Input, NgModule } from '@angular/core';
import { ButtonModule, DropdownModule } from 'zigzag';
import { IconModule } from '@flare/ui/components';

@Component({
  selector: 'flare-feeds-header',
  template: ` <div
    class="sticky top-0 z-50 flex h-14 items-center justify-between bg-white bg-opacity-70 px-4 backdrop-blur"
  >
    <div class="text-lg font-bold text-slate-800">
      <h3>{{ title }}</h3>
    </div>
    <div class="">
      <ng-content></ng-content>
    </div>
  </div>`,
})
export class FlareFeedsHeaderComponent {
  @Input()
  title!: string;
}

@NgModule({
  declarations: [FlareFeedsHeaderComponent],
  imports: [DropdownModule, IconModule, ButtonModule],
  exports: [FlareFeedsHeaderComponent],
})
export class FlareFeedsHeaderModule {}
