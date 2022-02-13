import { Component, Input, SecurityContext } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { isNil } from 'lodash-es';

@Component({
  selector: 'flare-block-text-renderer',
  template: ` <div [innerHTML]="content$ | async"></div>`,
})
export class FlareBlockTextRendererComponent {
  private readonly contentSubject = new BehaviorSubject<string>('');
  public readonly content$ = this.contentSubject.asObservable();

  constructor(private readonly sanitizer: DomSanitizer) {}
  @Input()
  set content(content: any) {
    if (!isNil(content)) {
      const sanitized = this.sanitizer.sanitize(
        SecurityContext.HTML,
        content?.value
      );
      if (sanitized) {
        this.contentSubject.next(sanitized);
      }
    }
  }
}
