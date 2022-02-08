import {
  AfterViewInit,
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ButtonModule, TooltipModule } from 'zigzag';
import { IconModule } from '../icon/icon.module';
import { exec, init, PellElement } from 'pell';
import Autolinker from 'autolinker';
import { getHighlighter, Highlighter, setCDN } from 'shiki';

@Component({
  selector: 'flare-composer',
  templateUrl: 'composer.component.html',
})
export class ComposerComponent implements AfterViewInit, OnInit {
  content = 'Share away what you are working on!';
  @ViewChild('editor', { static: true })
  private readonly editorRef?: ElementRef;

  editor!: PellElement;
  highligher!: Highlighter;
  async ngOnInit() {
    setCDN('https://unpkg.com/shiki/');
    this.highligher = await getHighlighter({
      theme: 'nord',
    });
  }
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
    exec('code', '<pre><code>' + this.content + '</code></pre>');
  }
}

@NgModule({
  declarations: [ComposerComponent],
  imports: [ButtonModule, IconModule, TooltipModule],
  exports: [ComposerComponent],
})
export class ComposerModule {}
