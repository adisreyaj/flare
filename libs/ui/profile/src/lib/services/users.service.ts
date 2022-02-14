import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import {
  map,
  mapTo,
  Observable,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { User } from '@flare/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly refreshSubject = new Subject<void>();
  constructor(private apollo: Apollo) {}

  getByUsername(username: string) {
    return this.refreshSubject.asObservable().pipe(
      startWith(''),
      mapTo(true),
      switchMap((refresh) => this.getUserObservable(refresh, username))
    );
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
        }),
        tap(() => {
          this.refreshSubject.next();
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
        }),
        tap(() => {
          this.refreshSubject.next();
        })
      );
  }

  private getUserObservable(refresh: boolean, username: string) {
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
              isFollowing
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
        variables: {
          username: username,
        },
      })
      .pipe(map((result) => result.data.userByUsername));
  }
}
