import { HttpException, HttpStatus, InternalServerErrorException } from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export class ExceptionUtils {
  static convertToHttpException(exception: unknown): HttpException {
    console.log(exception);
    if (exception instanceof HttpException) {
      return exception;
    }

    const prismaHttpException = ExceptionUtils.convertToHttpExceptionIfPrismaException(exception);

    return (
      prismaHttpException ??
      new InternalServerErrorException('Internal server error.', {
        cause: new Error(),
        description: 'Internal server error.',
      })
    );
  }

  private static convertToHttpExceptionIfPrismaException(
    exception: unknown,
  ): HttpException | undefined {
    let caught = false;
    let message = 'Internal server error.';
    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2001':
        case 'P2025':
          message = `The record doesn't exist`;
          status = HttpStatus.NOT_FOUND;
          break;
        case 'P2002':
          message = `Duplicate field value: ${exception.meta?.target}`;
          status = HttpStatus.CONFLICT;
          break;
        case 'P2003':
          message = `Invalid input data was provided.`;
          status = HttpStatus.CONFLICT;
          break;
        case 'P2019':
          message = `Invalid input data: ${exception.meta?.target}`;
          status = HttpStatus.CONFLICT;
          break;
        case 'C2000':
          message = exception.message;
          status = HttpStatus.CONFLICT;
          break;
      }

      caught = true;
    }

    if (exception instanceof PrismaClientValidationError) {
      message = 'Invalid input data was provided.';
      status = HttpStatus.CONFLICT;
      caught = true;
    }

    caught =
      caught ||
      exception instanceof PrismaClientInitializationError ||
      exception instanceof PrismaClientRustPanicError ||
      exception instanceof PrismaClientUnknownRequestError;

    if (caught) {
      return new HttpException(
        {
          message,
          error: message,
          statusCode: status,
        },
        status,
      );
    }
  }
}
