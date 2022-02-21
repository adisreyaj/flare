import { Component } from '@angular/core';
import { EditorConfiguration } from 'codemirror';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BlockData, BlockType } from '@flare/api-interfaces';

@Component({
  selector: 'flare-block-script-input',
  template: `<div
    style="background-color: #292d3e;"
    class="relative rounded-md p-2"
  >
    <div
      class="absolute top-0 left-4 z-10 grid h-full place-items-center text-white"
    >
      <p>$</p>
    </div>
    <div class="pl-6">
      <flare-code-input
        mode="shell"
        [value]="control.value.content?.value ?? ''"
        [config]="codeInputConfig"
        (valueChange)="handleValueChange($event)"
      ></flare-code-input>
    </div>
  </div>`,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FlareBlockScriptInputComponent,
      multi: true,
    },
  ],
})
export class FlareBlockScriptInputComponent implements ControlValueAccessor {
  codeInputConfig: EditorConfiguration = {
    lineNumbers: false,
  };

  control = new FormControl([{ type: BlockType.script, content: '' }]);
  onChanged!: (value: BlockData) => void;
  onTouched!: () => void;

  handleValueChange(value: string) {
    this.onChanged({ type: BlockType.script, content: { value } });
  }

  writeValue(value: BlockData): void {
    this.control.setValue(value);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
