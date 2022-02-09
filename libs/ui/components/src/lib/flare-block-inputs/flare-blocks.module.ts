import { NgModule } from '@angular/core';
import { FlareBlockTextInputComponent } from './flare-block-text-input.component';
import { FlareBlockCodeInputComponent } from './flare-block-code-input.component';
import { FlareBlockPollInputComponent } from './flare-block-poll-input.component';
import { FlareBlockScriptInputComponent } from './flare-block-script-input.component';
import { CodeInputModule } from '../code-input/code-input.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    FlareBlockTextInputComponent,
    FlareBlockCodeInputComponent,
    FlareBlockPollInputComponent,
    FlareBlockScriptInputComponent,
  ],
  imports: [CodeInputModule, CommonModule],
  exports: [
    FlareBlockTextInputComponent,
    FlareBlockCodeInputComponent,
    FlareBlockPollInputComponent,
    FlareBlockScriptInputComponent,
  ],
})
export class FlareBlocksModule {}
