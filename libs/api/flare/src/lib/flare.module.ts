import { Module } from '@nestjs/common';
import { FlareService } from './flare.service';
import { FlaresResolver } from './flare.resolver';
import { PrismaModule } from '@flare/api/prisma';
import { BookmarkService } from './bookmark.service';
import { ApiMediaModule } from '@flare/api/media';

@Module({
  imports: [PrismaModule, ApiMediaModule],
  providers: [FlareService, BookmarkService, FlaresResolver],
})
export class FlareModule {}
