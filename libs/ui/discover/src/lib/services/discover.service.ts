import { Injectable } from '@angular/core';
import { Flare, User } from '@flare/api-interfaces';
import { Apollo, gql } from 'apollo-angular';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DiscoverService {
  constructor(private readonly apollo: Apollo) {}
  getAllBookmarkedFlares(refresh = false) {
    return this.apollo
      .query<{ popularFlares: Flare[] }>({
        query: gql`
          query GetPopularFlares {
            popularFlares {
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
      })
      .pipe(map(({ data }) => data.popularFlares));
  }

  getTopUsers(refresh = false) {
    return this.apollo
      .query<{ getTopUsers: User[] }>({
        query: gql`
          query getTopUsers {
            getTopUsers {
              id
              username
              image
              firstName
              lastName
            }
          }
        `,
        fetchPolicy: refresh ? 'network-only' : 'cache-first',
      })
      .pipe(map((result) => result.data.getTopUsers));
  }
}
