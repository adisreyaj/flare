import { Component, Input, NgModule } from '@angular/core';

@Component({
  selector: 'flare-profile-social',
  template: ` <ul class="flex items-center gap-4">
    <li>
      <a
        class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
        href=""
      >
        <img
          class="h-10 w-10 rounded-full bg-slate-100 p-1"
          src="assets/icons/social/twitter.svg"
          alt=""
        />
      </a>
    </li>
    <li>
      <a
        class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
        href=""
      >
        <img
          class="h-10 w-10 rounded-full bg-slate-100 p-1"
          src="assets/icons/social/linkedin.svg"
          alt=""
        />
      </a>
    </li>
    <li>
      <a
        class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
        href=""
      >
        <img
          class="h-10 w-10 rounded-full bg-slate-100 p-1"
          src="assets/icons/social/github.svg"
          alt=""
        />
      </a>
    </li>
    <li>
      <a
        class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
        href=""
      >
        <img
          class="h-10 w-10 rounded-full bg-slate-100 p-1"
          src="assets/icons/social/devto.svg"
          alt=""
        />
      </a>
    </li>
    <li>
      <a
        class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
        href=""
      >
        <img
          class="h-10 w-10 rounded-full bg-slate-100 p-1"
          src="assets/icons/social/hashnode.svg"
          alt=""
        />
      </a>
    </li>
    <li>
      <a
        class="flex items-center gap-1 rounded-full outline-none ring-primary hover:ring-2 focus:ring-2"
        href=""
      >
        <img
          class="h-10 w-10 rounded-full bg-slate-100 p-1"
          src="assets/icons/social/instagram.svg"
          alt=""
        />
      </a>
    </li>
  </ul>`,
})
export class ProfileSocialComponent {
  @Input()
  socials: any;
}

@NgModule({
  declarations: [ProfileSocialComponent],
  imports: [],
  exports: [ProfileSocialComponent],
})
export class ProfileSocialModule {}
