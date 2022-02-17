import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { UpdateUserInput } from '@flare/api-interfaces';
import { gql } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class UiOnboardingService {
  constructor(private readonly apollo: Apollo) {}

  completeProfile(input: UpdateUserInput) {
    return this.apollo.mutate({
      mutation: gql`
        mutation completeProfile($input: UpdateUserInput!) {
          completeProfile(input: $input) {
            id
          }
        }
      `,
      variables: {
        input,
      },
    });
  }
}
