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

@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: [join(process.cwd(), 'libs/**/*.graphql'), './**/*.graphql'],
      resolvers: { JSON: GraphQLJSON },
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('QUEUE_HOST'),
          port: +configService.get('QUEUE_PORT'),
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
