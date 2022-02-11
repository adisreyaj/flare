import { Module } from '@nestjs/common';
import { FlareService } from './flare.service';
import { FlaresResolver } from './flare.resolver';
import { PrismaModule } from '@flare/api/prisma';
import { BookmarkService } from './bookmark.service';

@Module({
  imports: [PrismaModule],
  providers: [FlareService, BookmarkService, FlaresResolver],
})
export class FlareModule {}
