import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanLoad,
  Route,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

/**
 * Guard that checks if the user is logged in or not.
 * If not redirect them to login page.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild, CanLoad, CanActivate {
  constructor(
    private readonly router: Router,
    private readonly authService: AuthService
  ) {}

  canLoad(_: Route) {
    return this.checkAccess();
  }

  canActivate(_: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.checkAccess(state);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    return this.checkAccess(state);
  }

  checkAccess(state?: RouterStateSnapshot) {
    return this.authService.isLoggedIn$.pipe(
      tap((isLoggedIn) => {
        console.log(`IS LOGGED IN: ${isLoggedIn}`);
        if (!isLoggedIn) {
          let options = {};
          if (state && state.url !== '/') {
            options = {
              queryParams: { returnUrl: state.url },
            };
          }
          this.router.navigate(['/login'], options);
        }
      }),
      catchError((err) => {
        if (err?.error) {
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }
}
