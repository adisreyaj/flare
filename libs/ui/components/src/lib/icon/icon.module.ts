import { NgModule } from '@angular/core';
import {
  RemixIconModule,
  RiBookmarkFill,
  RiBookmarkLine,
  RiChat1Line,
  RiChatPollLine,
  RiClipboardLine,
  RiCloseLine,
  RiCodeLine,
  RiCompass3Fill,
  RiCompass3Line,
  RiDeleteBack2Line,
  RiFullscreenExitFill,
  RiFullscreenFill,
  RiGithubLine,
  RiHeart2Fill,
  RiHeart2Line,
  RiHome2Fill,
  RiHome2Line,
  RiImageAddLine,
  RiImageLine,
  RiMoreFill,
  RiNotification4Fill,
  RiNotification4Line,
  RiQuillPenLine,
  RiShareLine,
  RiStackLine,
  RiTerminalBoxLine,
  RiText,
  RiUser3Fill,
  RiUser3Line,
} from 'angular-remix-icon';

@NgModule({
  imports: [
    RemixIconModule.configure({
      RiHome2Line,
      RiHome2Fill,
      RiNotification4Line,
      RiNotification4Fill,
      RiBookmarkLine,
      RiBookmarkFill,
      RiUser3Line,
      RiUser3Fill,
      RiCompass3Line,
      RiImageLine,
      RiCodeLine,
      RiTerminalBoxLine,
      RiStackLine,
      RiGithubLine,
      RiChatPollLine,
      RiHeart2Line,
      RiHeart2Fill,
      RiChat1Line,
      RiShareLine,
      RiFullscreenFill,
      RiFullscreenExitFill,
      RiText,
      RiCompass3Fill,
      RiClipboardLine,
      RiMoreFill,
      RiQuillPenLine,
      RiCloseLine,
      RiImageAddLine,
      RiDeleteBack2Line,
    }),
  ],
  exports: [RemixIconModule],
})
export class IconModule {}
