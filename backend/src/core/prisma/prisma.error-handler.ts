import { HttpException, HttpStatus } from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

export const tryHandlePrismaError = (error: any): void => {
  let caught = false;
  let message = 'Internal server error.';
  let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2001':
      case 'P2025':
        message = `The record doesn't exist`;
        status = HttpStatus.NOT_FOUND;
        break;
      case 'P2002':
        message = `Duplicate field value: ${error.meta?.target}`;
        status = HttpStatus.CONFLICT;
        break;
      case 'P2019':
        message = `Invalid input data: ${error.meta?.target}`;
        status = HttpStatus.CONFLICT;
        break;
    }

    caught = true;
  }

  if (error instanceof PrismaClientValidationError) {
    message = 'Invalid input data was provided.';
    status = HttpStatus.CONFLICT;
    caught = true;
  }

  caught =
    caught ||
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientUnknownRequestError;

  if (caught) {
    throw new HttpException(
      {
        message,
        error: message,
        statusCode: status,
      },
      status,
    );
  }
};
