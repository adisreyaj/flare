import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgModule,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as codemirror from 'codemirror';
import { EditorConfiguration } from 'codemirror';
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
import { defaultsDeep, isNil } from 'lodash-es';

@Component({
  selector: 'flare-code-input',
  template: ` <textarea #editor></textarea>`,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
        height: 100%;
      }
    `,
  ],
})
export class CodeInputComponent implements AfterViewInit, OnChanges {
  @ViewChild('editor', { static: true })
  readonly editorRef: ElementRef | null = null;
  editor: codemirror.EditorFromTextArea | null = null;

  @Input()
  mode = 'javascript';

  @Input()
  config: EditorConfiguration = {};
  @Output()
  private readonly valueChange = new EventEmitter<string>();
  private valuePrivate = '';
  private readonly defaultConfig = {
    theme: 'material-palenight',
    tabSize: 2,
    lineNumbers: true,
    scrollbarStyle: 'null',
  };

  @Input()
  set value(value: string | null | undefined) {
    if (!isNil(value)) {
      this.valuePrivate = value;
      if (this.editor) {
        this.editor.setValue(value);
      }
    }
  }

  get editorMode() {
    return this.editor?.getMode().name;
  }

  ngAfterViewInit() {
    this.initializeEditor();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mode']) {
      this.editor?.setOption('mode', changes['mode'].currentValue);
    }
  }

  private initializeEditor() {
    if (this.editorRef) {
      this.editor = codemirror.fromTextArea(this.editorRef.nativeElement, {
        ...defaultsDeep(this.config, this.defaultConfig),
        mode: this.mode,
      });
      this.editor.setValue(this.valuePrivate);
      this.editor.on('change', (instance, change) => {
        this.valuePrivate = instance.getValue();
        this.valueChange.emit(this.valuePrivate);
      });
    }
  }
}

@NgModule({
  declarations: [CodeInputComponent],
  imports: [],
  exports: [CodeInputComponent],
})
export class CodeInputModule {}

export const AVAILABLE_MODES = [
  'javascript',
  'text/typescript',
  'python',
  'htmlmixed',
  'css',
  'sass',
  'markdown',
  'shell',
];
