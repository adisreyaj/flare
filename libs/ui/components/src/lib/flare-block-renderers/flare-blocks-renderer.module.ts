import { NgModule } from '@angular/core';
import { FlareBlockTextRendererComponent } from './flare-block-text-renderer.component';
import { CommonModule } from '@angular/common';
import { FlareBlockScriptRendererComponent } from './flare-block-script-renderer.component';
import { CodeInputModule } from '../code-input/code-input.component';
import { IconModule } from '@flare/ui/components';
import { TooltipModule } from 'zigzag';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FlareBlockImageRendererComponent } from './flare-block-image-renderer.component';
import { MediaUrlPipeModule } from '../../../../shared/src/pipes/media-url.pipe';
import { FlareBlockCodeRendererComponent } from './flare-block-code-renderer.component';
import { CodeModePipeModule } from '../code-input/code-mode.pipe';

@NgModule({
  declarations: [
    FlareBlockTextRendererComponent,
    FlareBlockScriptRendererComponent,
    FlareBlockImageRendererComponent,
    FlareBlockCodeRendererComponent,
  ],
  imports: [
    CommonModule,
    CodeInputModule,
    IconModule,
    TooltipModule,
    ClipboardModule,
    MediaUrlPipeModule,
    CodeModePipeModule,
  ],
  exports: [
    FlareBlockTextRendererComponent,
    FlareBlockScriptRendererComponent,
    FlareBlockImageRendererComponent,
    FlareBlockCodeRendererComponent,
  ],
})
export class FlareBlocksRendererModule {}
