import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, mapTo, startWith, Subject, switchMap, tap } from 'rxjs';
import { GiveKudosInput, Kudos } from '@flare/api-interfaces';
import { gql } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class KudosService {
  private readonly updateKudosSubject = new Subject<void>();

  constructor(private readonly apollo: Apollo) {}

  getKudos(username: string) {
    return this.updateKudosSubject.asObservable().pipe(
      startWith(''),
      mapTo(true),
      switchMap((refresh) => this.getKudosByUsername(username, refresh))
    );
  }

  giveKudos(input: GiveKudosInput) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation GiveKudos($userId: ID!, $content: JSON!) {
            giveKudos(input: { userId: $userId, content: $content }) {
              id
            }
          }
        `,
        variables: {
          userId: input.userId,
          content: input.content,
        },
      })
      .pipe(tap(() => this.updateKudosSubject.next()));
  }

  private getKudosByUsername(username: string, refresh = false) {
    return this.apollo
      .query<{ userByUsername: { kudos: Kudos[] } }>({
        query: gql`
          query GetKudosByUsername($username: String!) {
            userByUsername(username: $username) {
              kudos {
                id
                kudosBy {
                  id
                  firstName
                  image
                  lastName
                  username
                }
                content
                createdAt
              }
            }
          }
        `,
        variables: {
          username,
        },
        fetchPolicy: refresh ? 'network-only' : 'cache-first',
      })
      .pipe(map((result) => result.data.userByUsername.kudos));
  }
}
