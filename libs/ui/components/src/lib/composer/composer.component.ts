import {
  AfterViewInit,
  Component,
  ElementRef,
  NgModule,
  ViewChild,
} from '@angular/core';
import { ButtonModule, ModalService, TooltipModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import { init, PellElement } from 'pell';
import Autolinker from 'autolinker';
import { CodeSnippetModalComponent } from './modals/code-snippet.modal';

@Component({
  selector: 'flare-composer',
  templateUrl: 'composer.component.html',
})
export class ComposerComponent implements AfterViewInit {
  content = 'Share away what you are working on!';
  @ViewChild('editor', { static: true })
  private readonly editorRef?: ElementRef;

  editor!: PellElement;

  constructor(private readonly modal: ModalService) {}

  ngAfterViewInit() {
    if (this.editorRef) {
      this.editor = init({
        element: this.editorRef.nativeElement,
        onChange: (html) => {
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
        },
        defaultParagraphSeparator: 'p',
        styleWithCSS: true,
        actions: ['code'],
        classes: {
          actionbar: 'flare-composer-actionbar',
          button: 'flare-composer-button',
          content: 'flare-composer-content',
          selected: 'flare-composer-selected',
        },
      });

      this.editor.content.innerHTML = 'Share away what you are working on!';
    }
  }

  addCodeSnippet() {
    this.modal.open(CodeSnippetModalComponent, {
      size: 'lg',
    });
  }
}

@NgModule({
  declarations: [ComposerComponent],
  imports: [ButtonModule, IconModule, TooltipModule],
  exports: [ComposerComponent],
})
export class ComposerModule {}
