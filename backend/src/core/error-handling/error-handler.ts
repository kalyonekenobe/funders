import { InternalServerErrorException } from '@nestjs/common';
import { tryHandlePrismaError } from '../prisma/prisma.error-handler';

export const throwHttpExceptionBasedOnErrorType = (error: any): never => {
  tryHandlePrismaError(error);
  throw new InternalServerErrorException('Internal server error.', {
    cause: new Error(),
    description: 'Internal server error.',
  });
};