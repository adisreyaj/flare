import { Injectable } from '@angular/core';
import { map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';
import { Flare } from '@flare/api-interfaces';
import { Apollo, gql } from 'apollo-angular';

@Injectable({
  providedIn: 'root',
})
export class UiBookmarkService {
  bookmarkedFlares$: Observable<Flare[]>;

  private refreshSubject = new Subject<void>();
  private readonly refresh$ = this.refreshSubject.asObservable();
  constructor(private readonly apollo: Apollo) {
    this.bookmarkedFlares$ = this.refresh$.pipe(
      startWith(null),
      switchMap(() => this.getAllBookmarkedFlares(true)),
      map((result) => result.data.bookmarkedFlares)
    );
  }

  getAllBookmarkedFlares(refresh = false) {
    return this.apollo.query<{ bookmarkedFlares: Flare[] }>({
      query: gql`
        query GetBookmarkedFlares {
          bookmarkedFlares {
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

  removeBookmark(id: string) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation RemoveBookmark($id: ID!) {
            removeBookmark(id: $id) {
              success
            }
          }
        `,
        variables: { id },
      })
      .pipe(tap(() => this.refreshSubject.next()));
  }
}
