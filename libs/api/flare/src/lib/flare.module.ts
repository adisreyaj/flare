import { Module } from '@nestjs/common';
import { FlareService } from './flare.service';
import { FlaresResolver } from './flare.resolver';
import { PrismaModule } from '@flare/api/prisma';

@Module({
  imports: [PrismaModule],
  providers: [FlareService, FlaresResolver],
})
export class FlareModule {}
