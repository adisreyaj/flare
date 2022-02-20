import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Notification } from '@flare/api-interfaces';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UiNotificationsService {
  constructor(private readonly apollo: Apollo) {}

  getLatestNotifications(refresh: boolean = false) {
    return this.apollo
      .query<{ notifications: Notification[] }>({
        query: gql`
          query GetNotifications {
            notifications {
              id
              to {
                id
                image
                firstName
                lastName
              }
              type
              followee {
                id
                image
                firstName
                lastName
                email
                username
              }
              comment {
                id
                text
                createdAt
              }
              flare {
                id
              }
              content
              createdAt
              read
            }
          }
        `,
        fetchPolicy: refresh ? 'network-only' : 'cache-first',
      })
      .pipe(map(({ data }) => data.notifications));
  }
}
