import { NgModule } from '@angular/core';
import { FlareBlockTextRendererComponent } from './flare-block-text-renderer.component';
import { CommonModule } from '@angular/common';
import { FlareBlockScriptRendererComponent } from './flare-block-script-renderer.component';
import { CodeInputModule } from '../code-input/code-input.component';
import { IconModule } from '@flare/ui/components';
import { TooltipModule } from 'zigzag';
import { ClipboardModule } from '@angular/cdk/clipboard';

@NgModule({
  declarations: [
    FlareBlockTextRendererComponent,
    FlareBlockScriptRendererComponent,
  ],
  imports: [
    CommonModule,
    CodeInputModule,
    IconModule,
    TooltipModule,
    ClipboardModule,
  ],
  exports: [FlareBlockTextRendererComponent, FlareBlockScriptRendererComponent],
})
export class FlareBlocksRendererModule {}
