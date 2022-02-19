import { Component, Input, NgModule } from '@angular/core';
import { UserBio } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'flare-profile-social',
  template: ` <ul class="flex items-center gap-4" *ngIf="bio">
    <ng-container *ngIf="bio.twitter && bio.twitter !== ''">
      <li>
        <a
          class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
          [href]="bio.twitter"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="h-10 w-10 rounded-full bg-slate-100 p-1"
            src="assets/icons/social/twitter.svg"
            alt=""
          />
        </a>
      </li>
    </ng-container>
    <ng-container *ngIf="bio.linkedin && bio.linkedin !== ''">
      <li>
        <a
          class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
          [href]="bio.linkedin"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="h-10 w-10 rounded-full bg-slate-100 p-1"
            src="assets/icons/social/linkedin.svg"
            alt=""
          />
        </a>
      </li>
    </ng-container>
    <ng-container *ngIf="bio.github && bio.github !== ''">
      <li>
        <a
          class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
          [href]="bio.github"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="h-10 w-10 rounded-full bg-slate-100 p-1"
            src="assets/icons/social/github.svg"
            alt=""
          />
        </a>
      </li>
    </ng-container>
    <ng-container *ngIf="bio.devto && bio.devto !== ''">
      <li>
        <a
          class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
          [href]="bio.devto"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="h-10 w-10 rounded-full bg-slate-100 p-1"
            src="assets/icons/social/devto.svg"
            alt=""
          />
        </a>
      </li>
    </ng-container>
    <ng-container *ngIf="bio.hashnode && bio.hashnode !== ''">
      <li>
        <a
          class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
          [href]="bio.hashnode"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="h-10 w-10 rounded-full bg-slate-100 p-1"
            src="assets/icons/social/hashnode.svg"
            alt=""
          />
        </a>
      </li>
    </ng-container>
    <ng-container *ngIf="bio.instagram && bio.instagram !== ''">
      <li>
        <a
          class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
          [href]="bio.instagram"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            class="h-10 w-10 rounded-full bg-slate-100 p-1"
            src="assets/icons/social/instagram.svg"
            alt=""
          />
        </a>
      </li>
    </ng-container>
  </ul>`,
})
export class ProfileSocialComponent {
  @Input()
  bio?: UserBio | null;
}

@NgModule({
  declarations: [ProfileSocialComponent],
  imports: [CommonModule],
  exports: [ProfileSocialComponent],
})
export class ProfileSocialModule {}
