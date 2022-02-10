import {
  AfterViewInit,
  Component,
  ElementRef,
  SecurityContext,
  ViewChild,
} from '@angular/core';
import { init, PellElement } from 'pell';
import Autolinker from 'autolinker';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BlockData, BlockType } from '@flare/api-interfaces';
import { getPellEditorConfig } from './config';
import { DomSanitizer } from '@angular/platform-browser';
import { extractHashTags } from '@flare/ui/utils';

@Component({
  selector: 'flare-block-text-input',
  template: ` <div
    class="relative mt-[1px] flex flex-1 overflow-y-auto rounded-md bg-slate-100 ring-primary focus-within:ring-2"
    style="min-height: 100px; max-height: 200px;"
  >
    <div
      #editor
      class="absolute top-0 left-0 z-10 h-full w-full border-slate-100 font-medium text-transparent caret-slate-800"
    ></div>
    <div
      class="flare-block-text-input-rendered pointer-events-none z-20 h-full w-full border-slate-100 p-4 font-medium"
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
  onChanged!: (value: BlockData<BlockTextData>) => void;
  onTouched!: () => void;

  constructor(private sanitizer: DomSanitizer) {}

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
        className: 'flare-link',
      });
      this.content =
        this.sanitizer.sanitize(
          SecurityContext.HTML,
          extractHashTags(this.content).content
        ) ?? '';
      this.onChanged({
        type: BlockType.text,
        content: { value: this.content },
      });
    };
    if (this.editorRef) {
      this.editor = init(
        getPellEditorConfig(this.editorRef.nativeElement, onChange)
      );
    }
  }
  writeValue(value: BlockData<BlockTextData>): void {
    this.content = value.content.value;
  }

  registerOnChange(fn: any): void {
    this.onChanged = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}

export interface BlockTextData {
  value: string;
}
