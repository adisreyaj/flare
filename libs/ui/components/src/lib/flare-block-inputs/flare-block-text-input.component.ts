import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { init, PellElement } from 'pell';
import Autolinker from 'autolinker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BlockData, BlockType } from '@flare/api-interfaces';
import { getPellEditorConfig } from './config';

@Component({
  selector: 'flare-block-text-input',
  template: ` <div
    class="relative mt-[1px] flex flex-1 rounded-md bg-slate-100 focus-within:bg-slate-50"
    style="min-height: 100px"
  >
    <div
      #editor
      class="absolute top-0 left-0 z-10 h-full w-full border-slate-100 p-4 font-medium text-transparent caret-slate-800"
    ></div>
    <div
      class="pointer-events-none absolute top-0 left-0 z-20 h-full w-full border-slate-100 p-4 font-medium"
      [innerHTML]="content"
    ></div>
  </div>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
    `,
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: FlareBlockTextInputComponent,
      multi: true,
    },
  ],
})
export class FlareBlockTextInputComponent
  implements ControlValueAccessor, AfterViewInit
{
  content = 'Add your text here';
  @ViewChild('editor', { static: true })
  private readonly editorRef?: ElementRef;

  editor!: PellElement;
  onChanged!: (value: BlockData) => void;
  onTouched!: () => void;

  ngAfterViewInit() {
    const onChange = (html: string) => {
      this.content = Autolinker.link(html, {
        newWindow: true,
        urls: {
          tldMatches: true,
          wwwMatches: true,
        },
        stripPrefix: false,
        stripTrailingSlash: false,
        className: 'flare-composer-link',
      });
      this.onChanged({ type: BlockType.text, content: this.content });
    };
    if (this.editorRef) {
      this.editor = init(
        getPellEditorConfig(this.editorRef.nativeElement, onChange)
      );
    }
  }
  writeValue(value: BlockData<string>): void {
    this.content = value.content;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
