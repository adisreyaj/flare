import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map } from 'rxjs';
import { User } from '@flare/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private apollo: Apollo) {}

  getByUsername(username: string) {
    return this.apollo
      .query<{ userByUsername: User }>({
        query: gql`
          query getUser($username: String!) {
            userByUsername(username: $username) {
              id
              email
              username
              image
              firstName
              lastName
              _count
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
        variables: {
          username: username,
        },
      })
      .pipe(map((result) => result.data.userByUsername));
  }
}
