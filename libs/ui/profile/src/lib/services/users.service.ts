import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import { map, Observable } from 'rxjs';
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

  follow(userId: string): Observable<void> {
    return this.apollo
      .mutate<{ follow: User }>({
        mutation: gql`
          mutation FollowUser($userId: ID!) {
            follow(userId: $userId) {
              id
            }
          }
        `,
        variables: {
          userId: userId,
        },
      })
      .pipe(
        map(() => {
          return;
        })
      );
  }

  unfollow(userId: string): Observable<void> {
    return this.apollo
      .mutate<{ unfollow: User }>({
        mutation: gql`
          mutation UnfollowUser($userId: ID!) {
            unfollow(userId: $userId) {
              id
            }
          }
        `,
        variables: {
          userId: userId,
        },
      })
      .pipe(
        map(() => {
          return;
        })
      );
  }
}
