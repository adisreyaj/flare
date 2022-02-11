import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { UsersModule } from '@flare/api/users';
import { PrismaModule } from '@flare/api/prisma';
import { FlareModule } from '@flare/api/flare';
import { SponsorsModule } from '@flare/api/sponsors';
import { TipsModule } from '@flare/api/tips';
import { join } from 'path';
import { AuthGuard, AuthModule } from '@flare/api/auth';
import { APP_GUARD } from '@nestjs/core';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLUpload } from 'graphql-upload';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [join(process.cwd(), 'libs/**/*.graphql'), './**/*.graphql'],
      resolvers: { JSON: GraphQLJSON, UPLOAD: GraphQLUpload },
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FlareModule,
    SponsorsModule,
    TipsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
