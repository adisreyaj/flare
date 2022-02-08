import {
  AfterViewInit,
  Component,
  ElementRef,
  NgModule,
  ViewChild,
} from '@angular/core';
import { ButtonModule } from 'zigzag';
import { Highlighter } from 'shiki';
import * as codemirror from 'codemirror';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/mode/css/css.js';
import 'codemirror/mode/dart/dart';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/mode/markdown/markdown';
import 'codemirror/mode/python/python';
import 'codemirror/mode/sass/sass';
import 'codemirror/mode/shell/shell';
import 'codemirror/mode/vue/vue';
import 'codemirror/mode/yaml/yaml';

@Component({
  template: `
    <header class="mb-6">
      <p class="modal-title">Add Code Snippet</p>
    </header>

    <section
      class="flex-1 w-full text-sm relative overflow-auto rounded-md"
      style="min-height: 200px"
    >
      <textarea #editor class="" aria-label="Snippet content"></textarea>
    </section>
    <footer class="flex gap-4 mt-6">
      <button zzButton variant="primary">Add</button>
      <button zzButton>Close</button>
    </footer>
  `,
  styles: [
    `
      :host {
        @apply flex flex-col h-full p-4;
      }
    `,
  ],
})
export class CodeSnippetModalComponent implements AfterViewInit {
  highlighter!: Highlighter;
  @ViewChild('editor', { static: true })
  readonly editorRef: ElementRef | null = null;
  editor: codemirror.EditorFromTextArea | null = null;

  ngAfterViewInit() {
    this.initializeEditor();
  }

  private initializeEditor() {
    if (this.editorRef) {
      this.editor = codemirror.fromTextArea(this.editorRef.nativeElement, {
        theme: 'material-palenight',
        mode: 'javascript',
        tabSize: 2,
        lineNumbers: true,
        scrollbarStyle: 'null',
      });
      this.editor.setValue(``);
    }
  }
}

@NgModule({
  declarations: [CodeSnippetModalComponent],
  exports: [CodeSnippetModalComponent],
  imports: [ButtonModule],
})
export class CodeSnippetModalModule {}
