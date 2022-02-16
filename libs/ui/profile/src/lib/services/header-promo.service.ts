import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HeaderPromoInput } from '@flare/api-interfaces';
import { gql } from '@apollo/client/core';

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
}
