import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { UpdateUserInput, User } from '@flare/api-interfaces';
import { gql } from '@apollo/client/core';
import { map } from 'rxjs';

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

  getTopUsers(refresh = false) {
    return this.apollo
      .query<{ getTopUsers: User[] }>({
        query: gql`
          query GetTopUsers {
            getTopUsers {
              id
              image
              firstName
              lastName
              username
              followers {
                id
              }
            }
          }
        `,
        fetchPolicy: refresh ? 'network-only' : 'cache-first',
      })
      .pipe(map((res) => res.data.getTopUsers));
  }

  completeOnboarding() {
    return this.apollo.mutate({
      mutation: gql`
        mutation CompleteOnboarding {
          completeOnboarding {
            success
          }
        }
      `,
    });
  }
}
