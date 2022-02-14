import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateFlareInput, Flare } from '@flare/api-interfaces';
import { map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlareService {
  flares$: Observable<Flare[]>;

  private refreshSubject = new Subject<void>();
  private readonly refresh$ = this.refreshSubject.asObservable();
  constructor(private readonly apollo: Apollo) {
    this.flares$ = this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.getAll(true)),
      map((result) => result.data.flares)
    );
  }

  getAll(refresh = false) {
    return this.apollo.query<{ flares: Flare[] }>({
      query: gql`
        query GetFlares {
          flares {
            id
            blocks {
              id
              type
              content
            }
            bookmarks {
              id
            }
            author {
              id
              firstName
              lastName
              image
              username
            }
            deleted
            likes {
              id
              reaction
            }
            comments {
              id
              text
              createdAt
            }
            createdAt
            _count
          }
        }
      `,
      fetchPolicy: refresh ? 'network-only' : 'cache-first',
    });
  }

  newFlare(input: CreateFlareInput) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation CreateFlare($input: CreateFlareInput!) {
            createFlare(input: $input) {
              id
              blocks {
                id
              }
              createdAt
            }
          }
        `,
        variables: {
          input,
        },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }

  delete(id: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation DeleteFlare($id: ID!) {
            deleteFlare(id: $id) {
              id
            }
          }
        `,
        variables: {
          id,
        },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }

  like(id: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation LikeFlare($id: ID!, $reaction: String!) {
            addLike(input: { flareId: $id, reaction: $reaction }) {
              id
            }
          }
        `,
        variables: {
          id: id,
          reaction: 'like',
        },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }

  removeLike(flareId: string, likeId: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation RemoveLike($flareId: ID!, $likeId: ID!) {
            removeLike(input: { flareId: $flareId, likeId: $likeId }) {
              id
            }
          }
        `,
        variables: {
          flareId,
          likeId,
        },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }

  bookmark(flareId: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation BookmarkFlare($flareId: ID!) {
            bookmark(flareId: $flareId) {
              id
            }
          }
        `,
        variables: {
          flareId,
        },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }

  removeBookmark(bookmarkId: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation RemoveBookmark($bookmarkId: ID!) {
            removeBookmark(id: $bookmarkId) {
              success
            }
          }
        `,
        variables: {
          bookmarkId,
        },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }
}
