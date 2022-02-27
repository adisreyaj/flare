import { Component, NgModule } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'zigzag';
import { UiOnboardingService } from './services/ui-onboarding.service';
import { mapTo, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { User } from '@flare/api-interfaces';
import { CommonModule } from '@angular/common';
import { UsersService } from '@flare/ui/profile';

@Component({
  selector: 'flare-onboarding-explore',
  template: ` <header class="text-center">
      <h1 class="text-2xl font-semibold">Lets Start!</h1>
      <p class="text-slate-500">
        Follow a atleast 2 accounts so that we can build your feed!
      </p>
    </header>
    <div class="grid flex-1 place-items-center pt-10">
      <section>
        <ul class="flex items-center gap-4 overflow-x-auto">
          <ng-container *ngFor="let user of topUsers$ | async | slice: 0:5">
            <li class="w-60 rounded-md border border-slate-200 p-4">
              <header class="mb-2 flex w-full justify-center">
                <img
                  class="h-24 w-24 rounded-full"
                  [src]="user.image"
                  [alt]="user.firstName"
                />
              </header>
              <div class="text-center">
                <p class="text-md font-medium">{{ user.firstName }}</p>
                <p class="text-sm text-slate-500">{{ user.username }}</p>
              </div>
              <footer class="mt-4 flex justify-center">
                <button
                  zzButton
                  size="sm"
                  variant="primary"
                  [disabled]="user.followers!.length > 0"
                  (click)="follow(user)"
                >
                  {{ user.followers!.length > 0 ? 'Following' : 'Follow' }}
                </button>
              </footer>
            </li>
          </ng-container>
        </ul>
      </section>
      <footer class="flex items-center gap-4 pt-4">
        <button
          zzButton
          variant="primary"
          [disabled]="following < 1"
          (click)="completeOnboarding()"
        >
          Continue
        </button>
      </footer>
    </div>`,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        height: 100%;
      }
    `,
  ],
})
export class UiOnboardingExploreComponent {
  topUsers$: Observable<User[]>;
  following = 0;

  private refreshSubject = new Subject<void>();

  constructor(
    private readonly onboardingService: UiOnboardingService,
    private readonly usersService: UsersService,
    private readonly router: Router
  ) {
    this.topUsers$ = this.refreshSubject.pipe(
      startWith(''),
      mapTo(true),
      switchMap((refresh) => this.onboardingService.getTopUsers(refresh)),
      tap((users) => {
        const following = users.filter(
          (user) => user.followers && user.followers.length > 0
        );
        this.following = following.length;
      })
    );
  }

  follow(user: User) {
    this.usersService.follow(user.id).subscribe(() => {
      this.following++;
      this.refreshSubject.next();
    });
  }

  completeOnboarding() {
    this.onboardingService.completeOnboarding().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}

@NgModule({
  declarations: [UiOnboardingExploreComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: UiOnboardingExploreComponent },
    ]),
    ButtonModule,
  ],
  exports: [UiOnboardingExploreComponent],
})
export class UiOnboardingExploreModule {}
