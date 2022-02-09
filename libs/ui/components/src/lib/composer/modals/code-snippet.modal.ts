import { Component, NgModule } from '@angular/core';
import { ButtonModule } from 'zigzag';
import { CodeInputModule } from '../../code-input/code-input.component';

@Component({
  template: `
    <header class="mb-6">
      <p class="modal-title">Add Code Snippet</p>
    </header>

    <section
      class="flex-1 w-full text-sm relative overflow-auto rounded-md"
      style="min-height: 200px"
    >
      <flare-code-input></flare-code-input>
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
export class CodeSnippetModalComponent {}

@NgModule({
  declarations: [CodeSnippetModalComponent],
  exports: [CodeSnippetModalComponent],
  imports: [ButtonModule, CodeInputModule],
})
export class CodeSnippetModalModule {}
