import { AuthGuard, AuthModule } from '@flare/api/auth';
import { FlareModule } from '@flare/api/flare';
import { ApiHeaderPromoModule } from '@flare/api/header-promo';
import { ApiMediaModule } from '@flare/api/media';
import { ApiNotificationsModule } from '@flare/api/notifications';
import { PrismaModule } from '@flare/api/prisma';
import { SponsorsModule } from '@flare/api/sponsors';
import { TipsModule } from '@flare/api/tips';
import { UsersModule } from '@flare/api/users';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { LoggerModule } from 'nestjs-pino';
import { join } from 'path';
import { ENVIRONMENT_VALIDATION_SCHEMA } from './config/environment.validator';
import { PrismaExceptionFilter } from '@flare/api/shared';

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        const isProd = configService.get('NODE_ENV') === 'production';
        return {
          typePaths: isProd
            ? ['./**/*.graphql']
            : [join(process.cwd(), 'libs/**/*.graphql'), './**/*.graphql'],
          resolvers: { JSON: GraphQLJSON },
          cors: {
            origin: true,
            credentials: true,
          },
          context: ({ req, res }) => ({ req, res }),
        };
      },
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: +configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          maxRetriesPerRequest: 5,
        },
        prefix: 'flare',
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: ENVIRONMENT_VALIDATION_SCHEMA,
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
    {
      provide: APP_FILTER,
      useClass: PrismaExceptionFilter,
    },
  ],
})
export class AppModule {}
