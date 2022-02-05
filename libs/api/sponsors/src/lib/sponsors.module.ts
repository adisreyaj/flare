import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsResolver } from './sponsors.resolver';
import { PrismaModule } from '@flare/api/prisma';

@Module({
  imports: [PrismaModule],
  providers: [SponsorsService, SponsorsResolver],
})
export class SponsorsModule {}
