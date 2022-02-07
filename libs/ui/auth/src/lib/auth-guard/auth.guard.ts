import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChild,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivateChild {
  constructor(private router: Router) {}
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    const token = localStorage.getItem('token') || null;
    if (token) {
      const isExpired = helper.isTokenExpired(token);
      if (!isExpired) {
        return true;
      }
    }
    let options = {};
    if (state.url !== '/') {
      options = {
        queryParams: { returnUrl: state.url },
      };
    }
    this.router.navigate(['/login'], options);
    return false;
  }
}
