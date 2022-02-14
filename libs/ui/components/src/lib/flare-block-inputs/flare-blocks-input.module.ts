import { NgModule } from '@angular/core';
import { FlareBlockTextInputComponent } from './flare-block-text-input.component';
import { FlareBlockCodeInputComponent } from './flare-block-code-input.component';
import { FlareBlockPollInputComponent } from './flare-block-poll-input.component';
import { FlareBlockScriptInputComponent } from './flare-block-script-input.component';
import { CodeInputModule } from '../code-input/code-input.component';
import { CommonModule } from '@angular/common';
import { FlareBlockImageInputComponent } from './flare-block-image-input.component';
import { IconModule } from '../icon/icon.module';
import { SanitizeUrlPipeModule } from '@flare/ui/shared';
import { ButtonModule, DropdownModule, TooltipModule } from 'zigzag';
import { CodeModePipeModule } from '../code-input/code-mode.pipe';

@NgModule({
  declarations: [
    FlareBlockTextInputComponent,
    FlareBlockCodeInputComponent,
    FlareBlockPollInputComponent,
    FlareBlockScriptInputComponent,
    FlareBlockImageInputComponent,
  ],
  imports: [
    CodeInputModule,
    CommonModule,
    SanitizeUrlPipeModule,
    IconModule,
    DropdownModule,
    ButtonModule,
    CodeModePipeModule,
    TooltipModule,
  ],
  exports: [
    FlareBlockTextInputComponent,
    FlareBlockCodeInputComponent,
    FlareBlockPollInputComponent,
    FlareBlockScriptInputComponent,
    FlareBlockImageInputComponent,
  ],
})
export class FlareBlocksInputModule {}
