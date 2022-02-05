import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { FlareModule } from './flare/flare.module';
import { SponsorsModule } from './sponsors/sponsors.module';
import { TipsModule } from './tips/tips.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
    }),
    UsersModule,
    PrismaModule,
    FlareModule,
    SponsorsModule,
    TipsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
