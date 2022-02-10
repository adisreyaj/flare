import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';
import { User } from '@flare/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  me() {
    return this.apollo
      .watchQuery<{ me: User }>({
        query: gql`
          query me {
            me {
              id
              email
              username
              image
              firstName
              lastName
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
      .valueChanges.pipe(map((result) => result.data.me));
  }
}
