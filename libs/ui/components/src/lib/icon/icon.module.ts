import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiBookmarkLine,
  RiChat1Line,
  RiChatPollLine,
  RiCodeBoxLine,
  RiCompass3Line,
  RiGithubLine,
  RiHeart2Line,
  RiHome2Line,
  RiImageLine,
  RiNotification4Line,
  RiShareLine,
  RiStackLine,
  RiTerminalBoxLine,
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
      RiImageLine,
      RiCodeBoxLine,
      RiTerminalBoxLine,
      RiStackLine,
      RiGithubLine,
      RiChatPollLine,
      RiHeart2Line,
      RiChat1Line,
      RiShareLine,
    }),
  ],
  exports: [RemixIconModule],
})
export class IconModule {}
