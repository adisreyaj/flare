import { Component, Input } from '@angular/core';
import { EditorConfiguration } from 'codemirror';

@Component({
  selector: 'flare-block-code-renderer',
  template: ` <div
    style="background-color: #292d3e;"
    class="relative rounded-md p-2"
  >
    <div class="">
      <flare-code-input
        [value]="content.value"
        [config]="codeInputConfig"
      ></flare-code-input>
    </div>

    <div
      class="absolute bottom-2 right-2 z-10 grid place-items-center text-white"
    >
      <button
        zzTooltip="Copy command"
        [cdkCopyToClipboard]="content.value"
        class="grid place-items-center rounded-full text-sm hover:text-primary"
      >
        <rmx-icon class="icon-xs" name="clipboard-line"></rmx-icon>
      </button>
    </div>

    <div class="absolute top-0 right-0 py-1 px-2 text-white">
      <p>{{ content.mode | codeMode }}</p>
    </div>
  </div>`,
})
export class FlareBlockCodeRendererComponent {
  @Input()
  content!: any;

  codeInputConfig: EditorConfiguration = {
    lineNumbers: false,
    readOnly: true,
    addModeClass: true,
    spellcheck: false,
  };

  constructor() {
    setTimeout(() => {
      console.log(this.content);
    }, 0);
  }
}
