import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { isNil } from 'lodash-es';

const SHORT_CODES: Record<string, string> = {
  javascript: 'js',
  'text/typescript': 'ts',
  python: 'py',
  htmlmixed: 'html',
  css: 'css',
  sass: 'sass',
  markdown: 'md',
  shell: 'sh',
};

const MODE_NAMES: Record<string, string> = {
  javascript: 'JavaScript',
  'text/typescript': 'TypeScript',
  python: 'Python',
  htmlmixed: 'HTML',
  css: 'CSS',
  sass: 'Sass',
  markdown: 'Markdown',
  shell: 'Shell',
};

@Pipe({
  name: 'codeMode',
})
export class CodeModePipe implements PipeTransform {
  transform(
    value: string | undefined,
    type: 'short' | 'full' = 'short'
  ): string {
    if (isNil(value)) {
      return '';
    }
    return type === 'short' ? SHORT_CODES[value] : MODE_NAMES[value];
  }
}

@NgModule({
  declarations: [CodeModePipe],
  exports: [CodeModePipe],
})
export class CodeModePipeModule {}
