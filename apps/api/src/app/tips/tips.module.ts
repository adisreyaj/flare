import { Module } from '@nestjs/common';
import { TipsService } from './tips.service';
import { PrismaModule } from '../prisma/prisma.module';
import { TipsResolver } from './tips.resolver';

@Module({
  imports: [PrismaModule],
  providers: [TipsService, TipsResolver],
})
export class TipsModule {}
