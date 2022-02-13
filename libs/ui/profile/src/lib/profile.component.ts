import { Component, Inject } from '@angular/core';
import { CURRENT_USER } from '@flare/ui/auth';
import { map, Observable, switchMap, withLatestFrom } from 'rxjs';
import { Blog, Kudos, User } from '@flare/api-interfaces';
import { DevToService } from './services/devto.service';
import { HashnodeService } from './services/hashnode.service';
import { KudosService } from './services/kudos.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './services/users.service';

@Component({
  selector: 'flare-profile',
  template: `
    <ng-container *ngIf="data$ | async as data">
      <header style="height: 280px">
        <div class="h-full">
          <img
            src="https://source.unsplash.com/1000x500"
            alt=""
            class="h-full w-full object-fill"
          />
        </div>
      </header>
      <div class="relative flex flex-col items-center pb-6">
        <ng-container *ngIf="!data.isExternalMode">
          <button class="absolute top-4 right-3" zzButton size="sm">
            Edit Profile
          </button>
        </ng-container>
        <div class="-mt-14 rounded-full bg-white p-2">
          <img
            [src]="data.user.image"
            [alt]="data.user.firstName"
            class="h-24 w-24 rounded-full"
          />
        </div>
        <section class="w-full px-6">
          <h1 class="text-center text-2xl font-bold">
            {{ data.user?.firstName }} {{ data.user?.lastName }}
          </h1>
          <p class="text-center">@{{ data.user?.username }}</p>
        </section>
        <section class="my-1">
          <div class="flex gap-4">
            <p>
              <strong class="font-semibold">{{
                data.user._count?.followers
              }}</strong>
              Followers
            </p>
            <p>
              <strong class="font-semibold">{{
                data.user._count?.following
              }}</strong>
              Following
            </p>
          </div>
        </section>
        <section class="mt-2" *ngIf="data.isExternalMode">
          <button variant="primary" zzButton (click)="follow(data.user)">
            Follow
          </button>
        </section>
        <section class="w-full py-6 px-6 text-center">
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
        <section class="w-full py-6 px-6">
          <header class="mb-4 flex items-center justify-between">
            <h4 class="font-semibold">Kudos</h4>
            <ng-container *ngIf="data.isExternalMode">
              <div>
                <button zzButton size="sm">Give Kudos</button>
              </div>
            </ng-container>
          </header>
          <flare-profile-kudos [kudos]="kudos$ | async"></flare-profile-kudos>
        </section>
        <section class="p-6">
          <header class="mb-4">
            <h4 class="font-semibold">Latest Hashnode Blogs</h4>
          </header>
          <flare-profile-blogs
            [blogs]="latestHashnodeBlogs$ | async"
          ></flare-profile-blogs>
        </section>
      </div>
    </ng-container>
  `,
})
export class ProfileComponent {
  latestHashnodeBlogs$: Observable<Blog[]>;
  latestDevToBlogs$: Observable<Blog[]>;
  kudos$: Observable<Kudos[]>;

  data$: Observable<{
    isExternalMode: boolean;
    user: User;
  }>;

  constructor(
    @Inject(CURRENT_USER) public readonly loggedInUser$: Observable<User>,
    private readonly hashnodeService: HashnodeService,
    private readonly devToService: DevToService,
    private readonly kudosService: KudosService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly usersService: UsersService
  ) {
    this.latestHashnodeBlogs$ =
      this.hashnodeService.getLatestBlogs('adisreyaj');
    this.latestDevToBlogs$ = this.devToService.getLatestBlogs('adisreyaj');
    this.kudos$ = this.kudosService.kudos$;
    const userName$: Observable<string> = this.activatedRoute.params
      .pipe()
      .pipe(map((params) => params['username']));

    this.data$ = this.loggedInUser$.pipe(
      withLatestFrom(userName$),
      switchMap(([loggedInUser, username]) => {
        return this.usersService.getByUsername(username).pipe(
          map((data) => ({
            user: data,
            isExternalMode: loggedInUser.username !== username,
          }))
        );
      })
    );
  }

  follow(user: User) {
    this.usersService.follow(user.id).subscribe();
  }

  unfollow(user: User) {
    this.usersService.unfollow(user.id).subscribe();
  }
}
