import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { gql } from '@apollo/client/core';
import {
  catchError,
  map,
  mapTo,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  tap,
} from 'rxjs';
import { SuccessResponse, User } from '@flare/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly refreshSubject = new Subject<void>();
  constructor(private readonly apollo: Apollo) {}

  getByUsername(username: string) {
    return this.refreshSubject.asObservable().pipe(
      startWith(''),
      mapTo(true),
      switchMap((refresh) => this.getUserObservable(refresh, username))
    );
  }

  refresh() {
    this.refreshSubject.next();
  }

  updateHeaderImage(jobId: string, preferenceId: string): Observable<boolean> {
    return this.apollo
      .mutate<{ updateHeaderImage: SuccessResponse }>({
        mutation: gql`
          mutation UpdateHeaderImage($jobId: String!, $preferenceId: ID!) {
            updateHeaderImage(
              input: { jobId: $jobId, preferenceId: $preferenceId }
            ) {
              success
            }
          }
        `,
        variables: {
          jobId,
          preferenceId,
        },
      })
      .pipe(
        map((res) => res?.data?.updateHeaderImage?.success ?? false),
        catchError(() => {
          return of(false);
        })
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
              preferences {
                id
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
        variables: {
          username: username,
        },
      })
      .pipe(map((result) => result.data.userByUsername));
  }
}
