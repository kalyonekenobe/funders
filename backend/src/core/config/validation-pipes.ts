import {
  BadRequestException,
  ConflictException,
  ParseArrayPipe,
  ValidationPipe,
} from '@nestjs/common';

const ValidationPipes = {
  validationPipe: new ValidationPipe({
    exceptionFactory: errors => {
      if (errors.find(error => Object.entries(error.constraints ?? {}).length > 0)) {
        return new ConflictException(
          errors.flatMap(error => Object.values(error.constraints ?? {})),
        );
      }

      return new BadRequestException(
        errors.flatMap(error => Object.values(error.constraints ?? {})),
      );
    },
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
  }),
  parseArrayPipe: <Items>(Items: new (...args: any[]) => Items) =>
    new ParseArrayPipe({
      items: Items,
      exceptionFactory: errors => {
        if (errors.find(error => Object.entries(error.constraints ?? {}).length > 0)) {
          return new ConflictException(
            errors.flatMap(error => Object.values(error.constraints ?? {})),
          );
        }

        return new BadRequestException(
          errors.flatMap(error => Object.values(error.constraints ?? {})),
        );
      },
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
};

export default ValidationPipes;
