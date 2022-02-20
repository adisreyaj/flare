import { ApiNotificationsService } from './api-notifications.service';
import { Query, Resolver } from '@nestjs/graphql';
import { CurrentUser } from '@flare/api/shared';

@Resolver('Notification')
export class NotificationsResolver {
  constructor(private notificationsService: ApiNotificationsService) {}

  @Query('notifications')
  findAll(@CurrentUser() user: CurrentUser) {
    return this.notificationsService.findAll(user);
  }
}
