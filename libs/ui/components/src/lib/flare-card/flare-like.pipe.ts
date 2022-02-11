import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { Flare } from '@flare/api-interfaces';

@Pipe({
  name: 'flareLikeIcon',
})
export class FlareLikeIconPipe implements PipeTransform {
  transform(flare: Flare): string {
    return flare.likes.length > 0 ? 'heart-2-fill' : 'heart-2-line';
  }
}

@NgModule({
  declarations: [FlareLikeIconPipe],
  exports: [FlareLikeIconPipe],
})
export class FlareLikeIconPipeModule {}
