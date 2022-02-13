import { Inject, NgModule, Pipe, PipeTransform } from '@angular/core';
import { API_CONFIG, ApiConfig } from '@flare/ui/shared';

@Pipe({
  name: 'mediaUrl',
})
export class MediaUrlPipe implements PipeTransform {
  constructor(@Inject(API_CONFIG) private apiConfig: ApiConfig) {}

  transform(value: string): string {
    return `${this.apiConfig.mediaURL}/${value}`;
  }
}

@NgModule({
  declarations: [MediaUrlPipe],
  exports: [MediaUrlPipe],
})
export class MediaUrlPipeModule {}
