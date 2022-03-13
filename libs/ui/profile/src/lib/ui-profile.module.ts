import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileBlogsModule } from './profile-blogs.component';
import {
  ButtonModule,
  DropdownModule,
  FormGroupModule,
  FormInputModule,
  ModalModule,
  ModalService,
} from 'zigzag';
import { ProfileSocialModule } from './profile-social.component';
import { ProfileKudosModule } from './profile-kudos.component';
import { IconModule } from '@flare/ui/components';
import {
  MediaUrlPipeModule,
  ProfileImageDefaultDirectiveModal,
} from '@flare/ui/shared';
import { ProfileSpotifyModule } from './profile-spotify.component';

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
    FormGroupModule.configure({
      profileForm: {
        username: {
          required: 'Username is required',
          usernameTaken: 'Username is taken',
          minlength: 'Username must be at least 3 characters',
          maxlength: 'Max length is 20 characters',
          pattern: 'Username can only contain alphanumeric characters and underscores',
        },
        firstName: {
          required: 'First name is required',
        },
        lastName: {
          required: 'Last name is required',
        },
        description: {
          required: 'Description is required',
          minlength: 'Minimum 3 characters',
          maxlength: 'Max allowed length is 256 characters',
        },
        github: {
          link: 'Please enter a valid GitHub URL',
        },
        twitter: {
          link: 'Please enter a valid Twitter URL',
        },
        facebook: {
          link: 'Please enter a valid Facebook URL',
        },
        linkedin: {
          link: 'Please enter a valid LinkedIn URL',
        },
        hashnode: {
          link: 'Please enter your Hashnode URL',
        },
        devto: {
          link: 'Please enter a valid dev.to profile URL',
        },
      },
    }),
    ProfileSpotifyModule,
    FormInputModule,
  ],
  providers: [ModalService],
})
export class UiProfileModule {}
