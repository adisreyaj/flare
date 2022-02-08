import { Component, NgModule } from '@angular/core';
import { ButtonModule, TooltipModule } from 'zigzag';
import { IconModule } from '@flare/ui/components';

@Component({
  selector: 'flare-card',
  templateUrl: './flare-card.component.html',
})
export class FlareCardComponent {}

@NgModule({
  declarations: [FlareCardComponent],
  exports: [FlareCardComponent],
  imports: [ButtonModule, IconModule, TooltipModule],
})
export class FlareCardModule {}
