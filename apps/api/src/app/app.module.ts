import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import GraphQLJSON from 'graphql-type-json';
import { UsersModule } from '@flare/api/users';
import { PrismaModule } from '@flare/api/prisma';
import { FlareModule } from '@flare/api/flare';
import { SponsorsModule } from '@flare/api/sponsors';
import { TipsModule } from '@flare/api/tips';
import { ApiMediaModule } from '@flare/api/media';
import { AuthGuard, AuthModule } from '@flare/api/auth';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { ApiHeaderPromoModule } from '@flare/api/header-promo';
import { ApiNotificationsModule } from '@flare/api/notifications';

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [join(process.cwd(), 'libs/**/*.graphql'), './**/*.graphql'],
      resolvers: { JSON: GraphQLJSON },
      cors: {
        origin: true,
        credentials: true,
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule.forRoot({
      exclude: ['auth'],
    }),
    AuthModule,
    UsersModule,
    PrismaModule,
    FlareModule,
    ApiMediaModule,
    SponsorsModule,
    TipsModule,
    ApiNotificationsModule,
    ApiHeaderPromoModule,
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
