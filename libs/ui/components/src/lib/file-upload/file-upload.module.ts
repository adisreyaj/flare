import { NgModule } from '@angular/core';
import { FileDndDirective } from './file-dnd.directive';

@NgModule({
  declarations: [FileDndDirective],
  exports: [FileDndDirective],
})
export class FileUploadModule {}
