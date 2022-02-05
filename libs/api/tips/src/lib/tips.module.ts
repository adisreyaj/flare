import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { TipsResolver } from './tips.resolver';
import { PrismaModule } from '@flare/api/prisma';

@Module({
  imports: [PrismaModule],
  providers: [TipsService, TipsResolver],
})
export class TipsModule {}
