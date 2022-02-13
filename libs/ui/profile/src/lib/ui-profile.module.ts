import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileBlogsModule } from './profile-blogs.component';
import { ButtonModule } from 'zigzag';

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
  ],
})
export class UiProfileModule {}
