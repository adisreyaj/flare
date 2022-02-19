import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanLoad,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from '@flare/ui/auth';
import { catchError, from, of, switchMap } from 'rxjs';

/**
 * Guard similar to `AuthGuard` but meant to be used on the login page.
 * It redirects user to home if already logged in.
 */
@Injectable({
  providedIn: 'root',
})
export class AlreadyLoggedInGuard implements CanActivate, CanLoad {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  canLoad() {
    return this.checkAccess();
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(route.url);
    return this.checkAccess();
  }

  checkAccess() {
    return this.authService.isLoggedIn$.pipe(
      switchMap((isLoggedIn) => {
        if (isLoggedIn) {
          return from(this.router.navigate(['/']));
        }
        return of(true);
      }),
      catchError((err) => {
        return of(true);
      })
    );
  }
}
