import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
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
import { DOCUMENT } from '@angular/common';

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
  implements ControlValueAccessor, AfterViewInit, OnDestroy
{
  content = 'Add your text here';
  @ViewChild('editor', { static: true })
  private readonly editorRef?: ElementRef;

  editor!: PellElement;
  onChanged!: (value: BlockData<BlockTextData>) => void;
  onTouched!: () => void;

  constructor(
    private sanitizer: DomSanitizer,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngAfterViewInit() {
    if (this.editorRef) {
      this.editor = init(
        getPellEditorConfig(
          this.editorRef.nativeElement,
          this.handleEditorChanges
        )
      );

      this.editorRef.nativeElement.addEventListener('paste', this.pasteAsText);
    }
  }

  ngOnDestroy() {
    this.editorRef?.nativeElement.removeEventListener(
      'paste',
      this.pasteAsText
    );
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

  /**
   * Paste contents as text.
   * Strips the HTML away
   *
   * @see https://htmldom.dev/paste-as-plain-text/
   */
  private pasteAsText = (e: ClipboardEvent) => {
    // Prevent the default action
    e.preventDefault();

    // Get the copied text from the clipboard
    const text = e.clipboardData ? e.clipboardData.getData('text/plain') : '';

    if (this.document.queryCommandSupported('insertText')) {
      this.document.execCommand('insertText', false, text);
    } else {
      // Insert text at the current position of caret
      const range = this.document.getSelection()?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        const textNode = this.document.createTextNode(text);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false);

        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  /**
   * Finds the links in the text and converts them to
   * anchor tags and also extracts hashtags
   * Content is sanitized to prevent XSS
   *
   * @param html - editor content
   */
  private handleEditorChanges = (html: string) => {
    const linkified = this.convertLinksToAnchorTags(html);
    const hashtagified = extractHashTags(linkified).content;
    this.content =
      this.sanitizer.sanitize(SecurityContext.HTML, hashtagified) ?? '';
    this.onChanged({
      type: BlockType.text,
      content: { value: this.content },
    });
  };

  /**
   * Converts links to anchor tags
   *
   * @param html - editor content
   */
  protected convertLinksToAnchorTags(html: string) {
    return Autolinker.link(html, {
      newWindow: true,
      urls: {
        tldMatches: true,
        wwwMatches: true,
      },
      stripPrefix: false,
      stripTrailingSlash: false,
      className: 'flare-link',
    });
  }
}

export interface BlockTextData {
  value: string;
}
