import { NgModule } from '@angular/core';
import { FlareBlockTextInputComponent } from './flare-block-text-input.component';
import { FlareBlockCodeInputComponent } from './flare-block-code-input.component';
import { FlareBlockPollInputComponent } from './flare-block-poll-input.component';
import { FlareBlockScriptInputComponent } from './flare-block-script-input.component';
import { CodeInputModule } from '../code-input/code-input.component';
import { CommonModule } from '@angular/common';
import { FlareBlockImageInputComponent } from './flare-block-image-input.component';
import { SanitizeUrlPipeModule } from '../../../../utils/src';
import { IconModule } from '../icon/icon.module';

@NgModule({
  declarations: [
    FlareBlockTextInputComponent,
    FlareBlockCodeInputComponent,
    FlareBlockPollInputComponent,
    FlareBlockScriptInputComponent,
    FlareBlockImageInputComponent,
  ],
  imports: [CodeInputModule, CommonModule, SanitizeUrlPipeModule, IconModule],
  exports: [
    FlareBlockTextInputComponent,
    FlareBlockCodeInputComponent,
    FlareBlockPollInputComponent,
    FlareBlockScriptInputComponent,
    FlareBlockImageInputComponent,
  ],
})
export class FlareBlocksInputModule {}
