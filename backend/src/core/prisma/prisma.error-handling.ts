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
  let message = 'Internal Server Error';
  let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;

  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2001':
        message = `The record doesn't exist`;
        status = HttpStatus.NOT_FOUND;
      case 'P2002':
        message = `Duplicate field value: ${error.meta.target}`;
        status = HttpStatus.CONFLICT;
      case 'P2019':
        message = `Invalid input data: ${error.meta.target}`;
        status = HttpStatus.CONFLICT;
    }

    caught = true;
  }

  if (error instanceof PrismaClientValidationError) {
    message = error.message;
    status = HttpStatus.CONFLICT;
    caught = true;
  }

  caught =
    error instanceof PrismaClientInitializationError ||
    error instanceof PrismaClientRustPanicError ||
    error instanceof PrismaClientUnknownRequestError;

  if (caught) {
    throw new HttpException(
      {
        error: message,
      },
      status,
    );
  }
};
