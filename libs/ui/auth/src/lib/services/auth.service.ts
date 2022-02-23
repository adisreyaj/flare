import { Inject, Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { User } from '@flare/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AUTH_CONFIG, AuthConfig } from '../auth.token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly isLoggedIn$ = this.me().pipe(map((user) => !!user));

  constructor(
    private apollo: Apollo,
    private readonly router: Router,
    private readonly http: HttpClient,
    @Inject(AUTH_CONFIG) private config: AuthConfig
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

  logout() {
    this.http.get(this.config.authURL + '/logout').subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
