import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CreateFlareInput, Flare } from '@flare/api-interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FlareService {
  constructor(private readonly apollo: Apollo) {}
  getAll() {
    return this.apollo
      .watchQuery<{ flares: Flare[] }>({
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
            }
          }
        `,
      })
      .valueChanges.pipe(map((result) => result.data.flares));
  }

  newFlare(input: CreateFlareInput) {
    return this.apollo.mutate({
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
    });
  }
}
