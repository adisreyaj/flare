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

const NEXT_STATE_ROUTE: Record<string, string[]> = {
  SIGNED_UP: ['/onboarding/profile'],
  SETUP_PROFILE: ['/onboarding/explore'],
  ONBOARDING_COMPLETE: ['/'],
};

/**
 * Guard which checks if the users has completed onboarding or not
 * If not completed will be redirected ot the onboarding page.
 *
 * To be used with all pages except the onboarding page itself
 */
@Injectable({
  providedIn: 'root',
})
export class OnboardingGuard implements CanLoad, CanActivate, CanActivateChild {
  onBoardingDetails$: Observable<{
    isOnboarded: boolean;
  }>;
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    this.onBoardingDetails$ = this.authService.me().pipe(
      map((user) => {
        if (!user.isOnboarded) {
          this.router.navigate(
            NEXT_STATE_ROUTE[user.onboardingState.state] ?? ['/']
          );
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
        return details.isOnboarded;
      })
    );
  }

  canActivate(): Observable<boolean> {
    return this.onBoardingDetails$.pipe(
      map((details) => {
        return details.isOnboarded;
      })
    );
  }

  canLoad(): Observable<boolean> {
    return this.onBoardingDetails$.pipe(
      map((details) => {
        return details.isOnboarded;
      })
    );
  }
}
