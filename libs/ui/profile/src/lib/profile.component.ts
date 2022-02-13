import { Component, Inject } from '@angular/core';
import { CURRENT_USER } from '@flare/ui/auth';
import { Observable } from 'rxjs';
import { Blog, Kudos, User } from '@flare/api-interfaces';
import { DevToService } from './services/devto.service';
import { HashnodeService } from './services/hashnode.service';
import { KudosService } from './services/kudos.service';

@Component({
  selector: 'flare-profile',
  template: `
    <ng-container *ngIf="user$ | async as user">
      <header style="height: 300px">
        <div class="h-full">
          <img
            src="https://source.unsplash.com/1600x900"
            alt=""
            class="h-full w-full object-fill"
          />
        </div>
      </header>
      <div
        class="relative flex flex-col items-center border-b border-slate-200 pb-6"
      >
        <button class="absolute top-4 right-3" zzButton size="sm">
          Edit Profile
        </button>
        <div class="-mt-14 rounded-full bg-white p-2">
          <img
            [src]="user.image"
            [alt]="user.firstName"
            class="h-24 w-24 rounded-full"
          />
        </div>
        <section class="px-6">
          <h1 class="text-2xl font-bold">
            {{ user?.firstName }} {{ user?.lastName }}
          </h1>
          <p class="text-center">@{{ user?.username }}</p>
        </section>
        <section class="my-1">
          <div class="flex gap-4">
            <p>
              <strong class="font-semibold">{{
                user._count?.followers
              }}</strong>
              Followers
            </p>
            <p>
              <strong class="font-semibold">{{
                user._count?.following
              }}</strong>
              Followers
            </p>
          </div>
        </section>
        <section class="py-6 px-6 text-center">
          <p class="text-slate-600">
            A Full stack developer working with Web technologies. Loves to build
            highly scalable and maintainable web applications and back-ends.
            Loves everything JavaScript
          </p>
        </section>
        <section
          class="flex w-full justify-center border-b border-slate-200 py-6"
        >
          <flare-profile-social></flare-profile-social>
        </section>
        <section class="py-6 px-6">
          <header class="mb-4 flex items-center justify-between">
            <h4 class="font-semibold">Kudos</h4>
            <div>
              <button zzButton size="sm">Give Kudos</button>
            </div>
          </header>
          <flare-profile-kudos [kudos]="kudos$ | async"></flare-profile-kudos>
        </section>
      </div>

      <section class="p-6">
        <header class="mb-4">
          <h4 class="font-semibold">Latest Hashnode Blogs</h4>
        </header>
        <flare-profile-blogs
          [blogs]="latestHashnodeBlogs$ | async"
        ></flare-profile-blogs>
      </section>
    </ng-container>
  `,
})
export class ProfileComponent {
  latestHashnodeBlogs$: Observable<Blog[]>;
  latestDevToBlogs$: Observable<Blog[]>;
  kudos$: Observable<Kudos[]>;
  constructor(
    @Inject(CURRENT_USER) public readonly user$: Observable<User>,
    private readonly hashnodeService: HashnodeService,
    private readonly devToService: DevToService,
    private readonly kudosService: KudosService
  ) {
    this.latestHashnodeBlogs$ =
      this.hashnodeService.getLatestBlogs('adisreyaj');
    this.latestDevToBlogs$ = this.devToService.getLatestBlogs('adisreyaj');
    this.kudos$ = this.kudosService.kudos$;
  }
}
