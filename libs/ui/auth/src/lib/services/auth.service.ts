import { Inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { User } from '@flare/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AUTH_CONFIG, AuthConfig } from '../auth.token';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly logoutSubject = new BehaviorSubject<boolean>(false);
  public readonly isLoggedIn$ = combineLatest([
    this.me(),
    this.logoutSubject.asObservable(),
  ]).pipe(map(([user, loggedOut]) => !loggedOut && !!user));

  constructor(
    private apollo: Apollo,
    private readonly router: Router,
    private readonly http: HttpClient,
    @Inject(AUTH_CONFIG) private config: AuthConfig,
    private readonly cookieService: CookieService
  ) {}

  me(refresh = false) {
    return this.apollo
      .query<{ me: User }>({
        query: gql`
          query me {
            me {
              id
              email
              image
              username
              firstName
              lastName
              _count
              isOnboarded
              onboardingState
              preferences {
                header {
                  image
                }
              }
              bio {
                id
                description
                github
                twitter
                linkedin
                facebook
                hashnode
                devto
              }
            }
          }
        `,
        fetchPolicy: refresh ? 'network-only' : 'cache-first',
      })
      .pipe(map((result) => result.data.me));
  }

  init() {
    return this.me();
  }

  async logout() {
    this.cookieService.deleteAll('/');
    this.logoutSubject.next(true);
    await this.apollo.client.resetStore();
    await this.router.navigate(['/login']);
  }
}
