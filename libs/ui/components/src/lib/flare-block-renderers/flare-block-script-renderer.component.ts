import { Component, Input, SecurityContext } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { isNil } from 'lodash-es';
import { EditorConfiguration } from 'codemirror';

@Component({
  selector: 'flare-block-script-renderer',
  template: `<div
    *ngIf="content$ | async as content"
    style="background-color: #292d3e;"
    class="relative rounded-md p-1"
  >
    <div
      class="absolute top-0 left-4 z-10 grid place-items-center text-sm text-white"
      [style.height.px]="36"
    >
      <p>$</p>
    </div>
    <div
      class="absolute top-0 right-2 z-10 grid place-items-center text-white"
      [style.height.px]="36"
    >
      <button
        zzTooltip="Copy command"
        [cdkCopyToClipboard]="content"
        class="grid place-items-center rounded-full text-sm hover:text-primary"
      >
        <rmx-icon class="icon-xs" name="clipboard-line"></rmx-icon>
      </button>
    </div>
    <div class="px-6">
      <flare-code-input
        style="font-size: 14px"
        mode="shell"
        [value]="content"
        [config]="codeInputConfig"
      ></flare-code-input>
    </div>
  </div>`,
})
export class FlareBlockScriptRendererComponent {
  codeInputConfig: EditorConfiguration = {
    lineNumbers: false,
    readOnly: true,
    addModeClass: true,
    spellcheck: false,
  };

  private readonly contentSubject = new BehaviorSubject<string>('');
  public readonly content$ = this.contentSubject.asObservable();

  constructor(private readonly sanitizer: DomSanitizer) {}
  @Input()
  set content(content: { value: string } | undefined | null) {
    if (!isNil(content)) {
      const sanitized = this.sanitizer.sanitize(
        SecurityContext.NONE,
        content?.value ?? ''
      );
      if (sanitized) {
        this.contentSubject.next(sanitized);
      }
    }
  }
}
