import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiBookmarkLine,
  RiCompass3Line,
  RiHome2Line,
  RiNotification4Line,
  RiUser3Line,
} from 'angular-remix-icon';

@NgModule({
  imports: [
    RemixIconModule.configure({
      RiHome2Line,
      RiNotification4Line,
      RiBookmarkLine,
      RiUser3Line,
      RiCompass3Line,
    }),
  ],
  exports: [RemixIconModule],
})
export class IconModule {}
