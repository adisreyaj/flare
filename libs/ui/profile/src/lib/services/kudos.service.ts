import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';
import { Kudos } from '@flare/api-interfaces';
import { gql } from '@apollo/client/core';

@Injectable({
  providedIn: 'root',
})
export class KudosService {
  kudos$: Observable<Kudos[]>;
  constructor(private readonly apollo: Apollo) {
    this.kudos$ = this.getKudos();
  }

  private getKudos() {
    return this.apollo
      .query<{ me: { kudos: Kudos[] } }>({
        query: gql`
          query GetMyKudos {
            me {
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
      })
      .pipe(map((result) => result.data.me.kudos));
  }
}
