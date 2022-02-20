import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaModule } from '@flare/api/prisma';
import { ApiNotificationsModule } from '@flare/api/notifications';
import { ApiMediaModule } from '@flare/api/media';

@Module({
  imports: [PrismaModule, ApiNotificationsModule, ApiMediaModule],
  providers: [UsersResolver, UsersService, UsersResolver],
})
export class UsersModule {}
