import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { User } from '@flare/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public readonly isLoggedIn$ = this.me().pipe(map((user) => !!user));

  constructor(private apollo: Apollo) {}

  me() {
    return this.apollo
      .query<{ me: User }>({
        query: gql`
          query me {
            me {
              id
              email
              username
              image
              firstName
              lastName
              _count
              isOnboarded
              onboardingState
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
      })
      .pipe(map((result) => result.data.me));
  }

  init() {
    return this.me();
  }
}
