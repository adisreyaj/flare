import { Component, Inject } from '@angular/core';
import { CURRENT_USER } from '@flare/ui/auth';
import {
  combineLatest,
  filter,
  map,
  Observable,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { Blog, Kudos, User } from '@flare/api-interfaces';
import { DevToService } from './services/devto.service';
import { HashnodeService } from './services/hashnode.service';
import { KudosService } from './services/kudos.service';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from './services/users.service';
import { ModalService } from 'zigzag';
import { ProfileKudosModalComponent } from './modals/profile-kudos/profile-kudos-modal.component';

@Component({
  selector: 'flare-profile',
  template: `
    <ng-container *ngIf="data$ | async as data">
      <header class="aspect-header" style="max-height: 300px">
        <div class="h-full w-full">
          <img
            src="https://flare.adi.so/cool-stuffs/spotify-header/123"
            alt=""
            class="h-full w-full"
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
          <button
            [variant]="data.user.isFollowing ? 'neutral' : 'primary'"
            zzButton
            (click)="toggleFollow(data.user, data.user.isFollowing)"
          >
            {{ data.user.isFollowing ? 'Un Follow' : 'Follow' }}
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
        <section class="borer-slate-200 w-full border-b py-6 px-6">
          <header class="mb-4 flex items-center justify-between">
            <h4 class="font-semibold">Kudos</h4>
            <ng-container *ngIf="data.isExternalMode">
              <div>
                <button zzButton size="sm" (click)="giveKudos()">
                  Give Kudos
                </button>
              </div>
            </ng-container>
          </header>
          <ng-container *ngIf="kudos$ | async as kudos">
            <ng-container *ngIf="kudos.length > 0; else noKudos">
              <flare-profile-kudos [kudos]="kudos"></flare-profile-kudos>
            </ng-container>
            <ng-template #noKudos>
              <div class="grid place-items-center">
                <div class="flex flex-col items-center">
                  <img
                    class="h-20 w-20"
                    src="assets/images/kudos.svg"
                    alt="Kudos"
                  />
                  <p class="font-semibold">No kudos received</p>
                  <p class="text-slate-500">
                    Do amazing stuff and things will follow...
                  </p>
                </div>
              </div>
            </ng-template>
          </ng-container>
        </section>
        <section class="w-full p-6">
          <header class="mb-4">
            <h4 class="font-semibold">Latest Blogs</h4>
          </header>
          <ng-container
            *ngIf="latestHashnodeBlogs$ | async as latestHashnodeBlogs"
          >
            <ng-container *ngIf="latestHashnodeBlogs.length > 0; else noKudos">
              <flare-profile-blogs
                [blogs]="latestHashnodeBlogs"
              ></flare-profile-blogs>
            </ng-container>
            <ng-template #noKudos>
              <div class="grid place-items-center">
                <div class="flex flex-col items-center">
                  <img
                    class="h-20 w-20"
                    src="assets/images/blogs.svg"
                    alt="Kudos"
                  />
                  <p class="font-semibold">No blogs added</p>
                  <p class="text-slate-500">
                    Start by adding your hashnode or dev.to blog usernames in
                    profile.
                  </p>
                </div>
              </div>
            </ng-template>
          </ng-container>
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
    private readonly usersService: UsersService,
    private readonly modal: ModalService
  ) {
    this.latestHashnodeBlogs$ =
      this.hashnodeService.getLatestBlogs('adisreyaj');
    this.latestDevToBlogs$ = this.devToService.getLatestBlogs('adisreyaj');
    const userName$: Observable<string> = this.activatedRoute.params
      .pipe()
      .pipe(map((params) => params['username']));

    this.data$ = combineLatest([this.loggedInUser$, userName$]).pipe(
      switchMap(([loggedInUser, username]) => {
        return this.usersService.getByUsername(username).pipe(
          map((data) => ({
            user: data,
            isExternalMode: loggedInUser.username !== username,
          }))
        );
      })
    );
    this.kudos$ = this.data$.pipe(
      tap((data) => console.log(`Getting Kudos for ${data.user.username}`)),
      switchMap((data) => this.kudosService.getKudos(data.user.username))
    );
  }

  toggleFollow(user: User, isFollowing: boolean) {
    if (isFollowing) this.unfollow(user);
    else this.follow(user);
  }

  follow(user: User) {
    this.usersService.follow(user.id).subscribe();
  }

  unfollow(user: User) {
    this.usersService.unfollow(user.id).subscribe();
  }

  giveKudos() {
    const modalRef = this.modal.open(ProfileKudosModalComponent, {
      size: 'md',
    });

    modalRef.afterClosed$
      .pipe(
        filter((result) => !!result),
        withLatestFrom(this.data$.pipe(map((data) => data.user))),
        switchMap(([text, user]) =>
          this.kudosService.giveKudos({ userId: user.id, content: { text } })
        )
      )
      .subscribe();
  }
}
