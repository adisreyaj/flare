import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as NestLogger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  const globalPrefix = 'api';
  app.enableCors({
    origin: ['http://localhost:4200'],
  });
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3333;
  await app.listen(port);
  NestLogger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();

declare module 'express' {
  export interface Request {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
    };
  }
}
