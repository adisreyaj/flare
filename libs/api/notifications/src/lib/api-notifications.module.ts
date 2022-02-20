import { Module } from '@nestjs/common';
import { PrismaModule } from '@flare/api/prisma';
import { ApiNotificationsService } from './api-notifications.service';
import { NotificationsResolver } from './notificatins.resolver';

@Module({
  providers: [ApiNotificationsService, NotificationsResolver],
  imports: [PrismaModule],
  exports: [ApiNotificationsService],
})
export class ApiNotificationsModule {}
