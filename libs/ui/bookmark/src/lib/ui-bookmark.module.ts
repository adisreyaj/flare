import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarkComponent } from './bookmark.component';
import {
  FlareCardModule,
  FlareFeedsHeaderModule,
  IconModule,
} from '@flare/ui/components';
import { RouterModule } from '@angular/router';
import { ButtonModule, DropdownModule } from 'zigzag';

@NgModule({
  imports: [
    CommonModule,
    FlareCardModule,
    RouterModule.forChild([{ path: '', component: BookmarkComponent }]),
    FlareFeedsHeaderModule,
    DropdownModule,
    IconModule,
    ButtonModule,
  ],
  declarations: [BookmarkComponent],
  exports: [BookmarkComponent],
})
export class UiBookmarkModule {}
