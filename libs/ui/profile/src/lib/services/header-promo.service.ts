import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HeaderPromo, HeaderPromoInput } from '@flare/api-interfaces';
import { gql } from '@apollo/client/core';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HeaderPromoService {
  constructor(private apollo: Apollo) {}

  createHeaderPromo(input: HeaderPromoInput, jobId: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation CreateHeaderPromo($input: HeaderPromoInput!, $jobId: String!) {
          createHeaderPromo(input: $input, jobId: $jobId) {
            id
            title
            description
            image
            createdAt
            price
            state
          }
        }
      `,
      variables: {
        input,
        jobId,
      },
    });
  }

  getPromosReceived() {
    return this.apollo
      .query<{ allHeaderPromos: HeaderPromo[] }>({
        query: gql`
          query GetAllPromosReceived {
            allHeaderPromos {
              id
              title
              description
              image
              createdAt
              price
              state
              sponsor {
                firstName
                lastName
                email
                username
              }
              user {
                username
              }
            }
          }
        `,
      })
      .pipe(map((result) => result.data.allHeaderPromos));
  }

  applyPromoHeader(promoId: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ApplyHeaderPromo($id: ID!) {
          applyHeaderPromo(id: $id) {
            success
          }
        }
      `,
      variables: {
        id: promoId,
      },
    });
  }
}
