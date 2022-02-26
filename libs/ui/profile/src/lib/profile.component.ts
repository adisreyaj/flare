import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Blog,
  HeaderPromoInput,
  Kudos,
  User,
  UserPreferences,
} from '@flare/api-interfaces';
import { AuthService, CURRENT_USER } from '@flare/ui/auth';
import {
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
  withLatestFrom,
} from 'rxjs';
import { ModalService } from 'zigzag';
import { ProfileHeaderImageUploadComponent } from './modals/profile-header-image-upload/profile-header-image-upload.component';
import { ProfileHeaderPromoReceivedComponent } from './modals/profile-header-promo-received/profile-header-promo-received.component';
import { ProfileHeaderPromoSubmitModalComponent } from './modals/profile-header-promo-submit/profile-header-promo-submit.component';
import { ProfileKudosModalComponent } from './modals/profile-kudos/profile-kudos-modal.component';
import { DevToService } from './services/devto.service';
import { HashnodeService } from './services/hashnode.service';
import { HeaderPromoService } from './services/header-promo.service';
import { KudosService } from './services/kudos.service';
import { UsersService } from './services/users.service';
import { ProfileEditModalComponent } from './modals/profile-edit/profile-edit.component';
import { SpotifyLastPlayed, SpotifyService } from './services/spotify.service';
import { Nullable } from 'ts-toolbelt/out/Union/Nullable';

@Component({
  selector: 'flare-profile',
  template: `
    <ng-container *ngIf="data$ | async as data">
      <header class="relative">
        <div class="aspect-header h-full w-full">
          <img
            [src]="
              data?.user?.preferences?.header?.image?.name ||
                'default-header.jpeg' | mediaUrl
            "
            alt=""
            class="h-full w-full object-fill"
            style="max-height: 300px"
          />
        </div>
        <div class="absolute top-2 right-2" *ngIf="!data.isExternalMode">
          <button
            zzButton
            size="sm"
            (click)="updateHeaderImage(data.user.preferences)"
          >
            <div class="flex items-center gap-2">
              <rmx-icon class="icon-sm" name="image-add-line"></rmx-icon>
              <p>Change</p>
            </div>
          </button>
        </div>
      </header>
      <div class="relative flex flex-col items-center pb-6">
        <ng-container *ngIf="!data.isExternalMode">
          <button
            class="absolute top-4 left-3"
            zzButton
            size="sm"
            (click)="viewPromoProposals()"
          >
            Promo Proposals
          </button>
          <div class="absolute top-4 right-3">
            <button
              [zzDropdownTrigger]="flareMoreOptions"
              variant="link"
              zzButton
            >
              <rmx-icon class="icon-xs" name="more-fill"></rmx-icon>
              <zz-dropdown #flareMoreOptions>
                <div
                  zzDropdownItem
                  class="w-full"
                  zzDropdownCloseOnClick
                  (click)="editProfile()"
                >
                  Edit Profile
                </div>
                <div
                  class="w-full text-red-500"
                  zzDropdownItem
                  zzDropdownCloseOnClick
                  (click)="logout()"
                >
                  Logout
                </div>
              </zz-dropdown>
            </button>
          </div>
        </ng-container>
        <ng-container *ngIf="data.isExternalMode">
          <button
            class="absolute top-4 left-3"
            zzButton
            size="sm"
            (click)="submitPromoProposal()"
          >
            Submit Promo
          </button>
        </ng-container>
        <div class="-mt-14 rounded-full bg-white p-2">
          <img
            [src]="data.user.image"
            [flareDefaultImage]="data.user.username"
            [alt]="data.user.firstName"
            class="h-24 w-24 rounded-full"
          />
        </div>
        <section class="w-full px-6">
          <div class="flex items-center justify-center gap-2">
            <h1 class="text-center text-2xl font-bold">
              {{ data.user?.firstName }} {{ data.user?.lastName }}
            </h1>
            <img
              *ngIf="true"
              class="h-5 w-5"
              src="assets/icons/verified.svg"
              alt="Verified user"
            />
          </div>
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
        <ng-container *ngIf="data.user.bio?.description">
          <section class="w-full py-6 px-6 text-center">
            <p class="text-slate-600">
              {{ data.user.bio?.description }}
            </p>
          </section>
        </ng-container>
        <section
          class="flex w-full justify-center border-b border-slate-200 py-6"
        >
          <flare-profile-social [bio]="data.user.bio"></flare-profile-social>
        </section>
        <section
          class="borer-slate-200 w-full border-b py-6 px-6"
          *ngIf="(spotifyLastPlayed$ | async) !== false || !data.isExternalMode"
        >
          <ng-container>
            <header class="mb-4 flex items-center justify-between">
              <h4 class="font-semibold">Recently Played Songs</h4>
              <div class="flex gap-2">
                <p class="text-sm text-slate-500">Powered by</p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-6 w-6"
                  viewBox="0 0 2931 2931"
                >
                  <path
                    d="M1465.5 0C656.1 0 0 656.1 0 1465.5S656.1 2931 1465.5 2931 2931 2274.9 2931 1465.5C2931 656.2 2274.9.1 1465.5 0zm672.1 2113.6c-26.3 43.2-82.6 56.7-125.6 30.4-344.1-210.3-777.3-257.8-1287.4-141.3-49.2 11.3-98.2-19.5-109.4-68.7-11.3-49.2 19.4-98.2 68.7-109.4C1242.1 1697.1 1721 1752 2107.3 1988c43 26.5 56.7 82.6 30.3 125.6zm179.3-398.9c-33.1 53.8-103.5 70.6-157.2 37.6-393.8-242.1-994.4-312.2-1460.3-170.8-60.4 18.3-124.2-15.8-142.6-76.1-18.2-60.4 15.9-124.1 76.2-142.5 532.2-161.5 1193.9-83.3 1646.2 194.7 53.8 33.1 70.8 103.4 37.7 157.1zm15.4-415.6c-472.4-280.5-1251.6-306.3-1702.6-169.5-72.4 22-149-18.9-170.9-91.3-21.9-72.4 18.9-149 91.4-171 517.7-157.1 1378.2-126.8 1922 196 65.1 38.7 86.5 122.8 47.9 187.8-38.5 65.2-122.8 86.7-187.8 48z"
                    style="fill:#2ebd59"
                  />
                </svg>
              </div>
            </header>
            <ng-container
              *ngIf="
                spotifyLastPlayed$ | async as spotifyLastPlayed;
                else noSpotify
              "
            >
              <flare-profile-spotify
                [tracks]="spotifyLastPlayed"
              ></flare-profile-spotify>
            </ng-container>
            <ng-template #noSpotify>
              <div class="grid place-items-center" *ngIf="!data.isExternalMode">
                <div class="flex flex-col items-center">
                  <button
                    zzButton
                    variant="primary"
                    class="mt-4 mb-2"
                    size="sm"
                    (click)="authorizeSpotify(data.user.username)"
                  >
                    Connect Spotify
                  </button>
                  <p class="text-slate-500">
                    Integrate spotify to show the last played songs...
                  </p>
                </div>
              </div>
            </ng-template>
          </ng-container>
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
        <section
          class="w-full p-6"
          *ngIf="latestHashnodeBlogs$ | async as latestHashnodeBlogs"
        >
          <header class="mb-4">
            <h4 class="font-semibold">Latest Blogs</h4>
          </header>
          <ng-container>
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
  latestHashnodeBlogs$: Observable<Blog[] | null>;
  kudos$: Observable<Kudos[]>;
  spotifyLastPlayed$: Observable<SpotifyLastPlayed[] | boolean>;

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
    private readonly modal: ModalService,
    private readonly headerPromoService: HeaderPromoService,
    private readonly authService: AuthService,
    private readonly spotifyService: SpotifyService
  ) {
    const userName$: Observable<string> = this.activatedRoute.params.pipe(
      map((params) => params['username']),
      filterOutAppRoutes()
    );
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
      switchMap((data) => this.kudosService.getKudos(data.user?.username ?? ''))
    );

    this.spotifyLastPlayed$ = this.data$.pipe(
      switchMap((data) =>
        this.spotifyService.getLastPlayed(data.user?.username ?? '')
      )
    );

    this.latestHashnodeBlogs$ = this.data$.pipe(
      filter((data) => !!data),
      switchMap((data) => {
        if (data?.user?.bio?.hashnode) {
          const username = data.user.bio.hashnode.split('/@')[1];
          if (username) {
            return this.hashnodeService.getLatestBlogs(username);
          }
        }
        return of(null);
      })
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

  submitPromoProposal() {
    const modalRef = this.modal.open<
      void,
      { data: HeaderPromoInput; jobId: string }
    >(ProfileHeaderPromoSubmitModalComponent, {
      size: 'md',
    });

    modalRef.afterClosed$
      .pipe(
        filter((result) => !!result),
        withLatestFrom(this.data$.pipe(map((data) => data.user))),
        switchMap(([result, user]) =>
          this.headerPromoService.createHeaderPromo(
            { ...result.data, userId: user.id },
            result.jobId
          )
        )
      )
      .subscribe();
  }

  editProfile() {
    const modalRef = this.modal.open(ProfileEditModalComponent, {
      size: 'lg',
    });

    modalRef.afterClosed$.subscribe((success) => {
      success && this.usersService.refresh();
    });
  }

  viewPromoProposals() {
    this.modal.open(ProfileHeaderPromoReceivedComponent, {
      size: 'lg',
    });
  }

  updateHeaderImage(preferences: UserPreferences) {
    const modalRef = this.modal.open<{ preferenceId: string }, boolean>(
      ProfileHeaderImageUploadComponent,
      {
        size: 'lg',
        data: {
          preferenceId: preferences.id,
        },
      }
    );
    modalRef.afterClosed$.subscribe((success) => {
      success && this.usersService.refresh();
    });
  }

  logout() {
    this.authService.logout();
  }

  authorizeSpotify(username: Nullable<string>) {
    if (username) location.href = this.spotifyService.authorize(username);
  }
}

export const filterOutAppRoutes = () => (source: Observable<string>) =>
  source.pipe(
    filter(
      (routeParam) =>
        !['notifications', 'explore', 'bookmarks', 'profile'].includes(
          routeParam
        )
    )
  );
