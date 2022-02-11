import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sanitizeUrl',
})
export class SanitizeUrlPipe implements PipeTransform {
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(value: string = '') {
    return this.sanitizer.bypassSecurityTrustUrl(value);
  }
}

@NgModule({
  declarations: [SanitizeUrlPipe],
  exports: [SanitizeUrlPipe],
})
export class SanitizeUrlPipeModule {}
