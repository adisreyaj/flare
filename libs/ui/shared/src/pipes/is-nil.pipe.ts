import { NgModule, Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isNil',
})
export class IsNilPipe implements PipeTransform {
  transform(value: unknown): boolean {
    return value === null || value === undefined;
  }
}

@NgModule({
  declarations: [IsNilPipe],
  exports: [IsNilPipe],
})
export class IsNilPipeModule {}
