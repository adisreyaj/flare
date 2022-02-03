import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { FlareService } from './flare.service';
import { FlaresResolver } from './flare.resolver';

@Module({
  imports: [PrismaModule],
  providers: [FlareService, FlaresResolver],
})
export class FlareModule {}
