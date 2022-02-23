import { Logger } from 'nestjs-pino';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger as NestLogger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  if (process.env.NODE_ENV === 'production') {
    app.useLogger(app.get(Logger));
  }
  const globalPrefix = 'api';
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:4200', 'https://flare.adi.so'],
  });
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.use(helmet());
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
