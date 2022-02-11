import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateFlareInput, Flare } from '@flare/api-interfaces';
import { map, Observable, startWith, Subject, switchMap, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlareService {
  flares$: Observable<Flare[]>;

  private updateSubject = new Subject<void>();
  private readonly update$ = this.updateSubject.asObservable();
  constructor(private readonly apollo: Apollo) {
    this.flares$ = this.update$.pipe(
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
              createdAt
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
      .pipe(tap(() => this.updateSubject.next()));
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
      .pipe(tap(() => this.updateSubject.next()));
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
      .pipe(tap(() => this.updateSubject.next()));
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
      .pipe(tap(() => this.updateSubject.next()));
  }
}
