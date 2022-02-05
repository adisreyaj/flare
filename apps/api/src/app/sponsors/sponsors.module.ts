import { Module } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { SponsorsResolver } from './sponsors.resolver';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SponsorsService, SponsorsResolver],
})
export class SponsorsModule {}
