import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { isNil } from 'lodash-es';

@Pipe({
  name: 'sanitizeUrl',
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string | null = '') {
    if (isNil(value)) {
      return value;
    }
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}

@NgModule({
  declarations: [SanitizeUrlPipe],
  exports: [SanitizeUrlPipe],
})
export class SanitizeUrlPipeModule {}
