import { Component } from '@angular/core';
import { AVAILABLE_MODES } from '../code-input/code-input.component';
import { BehaviorSubject } from 'rxjs';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { BlockData, BlockType, CodeBlockData } from '@flare/api-interfaces';
import { isNil } from 'lodash-es';

@Component({
  selector: 'flare-block-code-input',
  template: ` <section class="relative" *ngIf="mode$ | async as mode">
    <div style="background-color: #292d3e;" class="relative rounded-md p-2">
      <div class="">
        <flare-code-input
          [value]="control.value"
          [mode]="mode"
          (valueChange)="handleValueChange($event, mode)"
        ></flare-code-input>
      </div>
    </div>
    <button
      class="absolute top-0 right-0 py-1 px-2 text-white"
      [zzDropdownTrigger]="modes"
      placement="bottom-start"
    >
      <p zzTooltip="Change Language">{{ mode | codeMode }}</p>
      <zz-dropdown #modes>
        <ng-container *ngFor="let mode of availableModes">
          <li class="w-full">
            <button
              zzButton
              size="sm"
              variant="link"
              class="w-full rounded-md"
              zzDropdownCloseOnClick
              (click)="changeMode(mode)"
            >
              <p class="text-left">{{ mode | codeMode: 'full' }}</p>
            </button>
          </li>
        </ng-container>
      </zz-dropdown>
    </button>
  </section>`,
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
      useExisting: FlareBlockCodeInputComponent,
      multi: true,
    },
  ],
})
export class FlareBlockCodeInputComponent implements ControlValueAccessor {
  availableModes = AVAILABLE_MODES;
  control = new FormControl(['']);
  onChanged!: (value: BlockData) => void;
  onTouched!: () => void;
  private modeSubject = new BehaviorSubject<string>(AVAILABLE_MODES[0]);
  mode$ = this.modeSubject.asObservable();

  changeMode(mode: string) {
    this.modeSubject.next(mode);
  }

  handleValueChange(value: string, mode: string) {
    this.onChanged({ type: BlockType.code, content: { value, mode } });
  }

  writeValue(value: CodeBlockData): void {
    if (!isNil(value.content.value)) this.control.setValue(value.content.value);
    if (!isNil(value.content.mode)) this.modeSubject.next(value.content.mode);
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
