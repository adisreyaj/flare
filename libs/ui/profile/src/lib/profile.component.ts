import { Component, Inject } from '@angular/core';
import { CURRENT_USER } from '@flare/ui/auth';
import { Observable } from 'rxjs';
import { User } from '@flare/api-interfaces';

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
      <div class="-mt-14 flex flex-col items-center">
        <div class="rounded-full bg-white p-2">
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
        <section class="mt-4 px-6 text-center">
          <!--          <p>{{ user?.bio?.description }}</p>-->
          <p class="text-slate-600">
            A Full stack developer working with Web technologies. Loves to build
            highly scalable and maintainable web applications and back-ends.
            Loves everything JavaScript
          </p>
        </section>
        <section class="mt-6">
          <ul class="flex items-center gap-4">
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
          </ul>
        </section>
      </div>
    </ng-container>
  `,
})
export class ProfileComponent {
  constructor(@Inject(CURRENT_USER) public readonly user$: Observable<User>) {}
}
