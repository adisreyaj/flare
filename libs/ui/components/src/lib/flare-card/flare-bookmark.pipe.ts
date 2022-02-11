import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Flare } from '@flare/api-interfaces';

@Pipe({
  name: 'flareBookmarkIcon',
})
export class FlareBookmarkIconPipe implements PipeTransform {
  transform(flare: Flare): string {
    return flare.bookmarks.length > 0 ? 'bookmark-fill' : 'bookmark-line';
  }
}

@NgModule({
  declarations: [FlareBookmarkIconPipe],
  exports: [FlareBookmarkIconPipe],
})
export class FlareBookmarkIconPipeModule {}
