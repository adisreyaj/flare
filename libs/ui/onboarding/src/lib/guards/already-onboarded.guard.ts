// implement angular guard
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  CanLoad,
  Router,
} from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '@flare/ui/auth';

/**
 * Guard which checks if the user is already onboarded.
 * If the user is already onboarded, the user is redirected to the home page.
 *
 * Only to be used for the onboarding route
 */
@Injectable({
  providedIn: 'root',
})
export class AlreadyOnboardedGuard
  implements CanLoad, CanActivate, CanActivateChild
{
  onBoardingDetails$: Observable<{
    isOnboarded: boolean;
  }>;
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.onBoardingDetails$ = this.authService.me().pipe(
      map((user) => {
        if (user.isOnboarded) {
          this.router.navigate(['/']);
        }
        return {
          isOnboarded: user.isOnboarded,
          onboardingState: user.onboardingState,
        };
      })
    );
  }

  canActivateChild(): Observable<boolean> {
    return this.onBoardingDetails$.pipe(
      map((details) => {
        return !details.isOnboarded;
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.onBoardingDetails$.pipe(
      map((details) => {
        return !details.isOnboarded;
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.onBoardingDetails$.pipe(
      map((details) => {
        return !details.isOnboarded;
      })
    );
  }
}
