import { Module } from '@nestjs/common';
import { UsersResolver } from './users.resolver';
import { UsersService } from './users.service';
import { PrismaModule } from '@flare/api/prisma';
import { ApiNotificationsModule } from '@flare/api/notifications';

@Module({
  imports: [PrismaModule, ApiNotificationsModule],
  providers: [UsersResolver, UsersService, UsersResolver],
})
export class UsersModule {}
