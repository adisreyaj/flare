import { Module } from '@nestjs/common';
import { ApiHeaderPromoService } from './api-header-promo.service';
import { PrismaModule } from '@flare/api/prisma';
import { HeaderPromoResolver } from './api-header-promo.resolver';
import { ApiMediaModule } from '@flare/api/media';

@Module({
  imports: [PrismaModule, ApiMediaModule],
  controllers: [],
  providers: [ApiHeaderPromoService, HeaderPromoResolver],
})
export class ApiHeaderPromoModule {}
