import { ArgumentsHost, Catch, HttpException, Logger } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { GqlExceptionFilter } from '@nestjs/graphql';

const PRISMA_ERROR_CODE_TO_STATUS = {
  P2025: {
    code: 404,
    message: 'Resource not found',
  },
};

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements GqlExceptionFilter {
  logger = new Logger(PrismaExceptionFilter.name);
  catch(exception: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const { code, message } = PRISMA_ERROR_CODE_TO_STATUS[exception.code] ?? {
      code: 500,
      message: 'Internal server error',
    };
    this.logger.error({
      code,
      message,
      exception,
    });
    return new HttpException(message, code);
  }
}
