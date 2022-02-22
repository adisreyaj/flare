import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileBlogsModule } from './profile-blogs.component';
import { ButtonModule, DropdownModule, ModalModule } from 'zigzag';
import { ProfileSocialModule } from './profile-social.component';
import { ProfileKudosModule } from './profile-kudos.component';
import { ProfileImageDefaultDirectiveModal } from '../../../shared/src/directives/profile-image-default.directive';
import { IconModule } from '@flare/ui/components';
import { MediaUrlPipeModule } from '@flare/ui/shared';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        component: ProfileComponent,
      },
    ]),
    ProfileBlogsModule,
    ButtonModule,
    ProfileSocialModule,
    ProfileKudosModule,
    ProfileImageDefaultDirectiveModal,
    IconModule,
    ModalModule,
    MediaUrlPipeModule,
    DropdownModule,
  ],
})
export class UiProfileModule {}
