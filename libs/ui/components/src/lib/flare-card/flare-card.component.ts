import { Component, Input, NgModule } from '@angular/core';
import { ButtonModule, TooltipModule } from 'zigzag';
import { IconModule } from '@flare/ui/components';
import { BlockType, Flare } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { FlareBlocksRendererModule } from '../flare-block-renderers/flare-blocks-renderer.module';

@Component({
  selector: 'flare-card',
  templateUrl: './flare-card.component.html',
})
export class FlareCardComponent {
  blockTypes = BlockType;

  @Input()
  flare!: Flare;
}

@NgModule({
  declarations: [FlareCardComponent],
  exports: [FlareCardComponent],
  imports: [
    ButtonModule,
    IconModule,
    TooltipModule,
    CommonModule,
    FlareBlocksRendererModule,
  ],
})
export class FlareCardModule {}
