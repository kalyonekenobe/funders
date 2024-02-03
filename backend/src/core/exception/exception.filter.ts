import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ExceptionUtils } from './exception.utils';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const context = host.switchToHttp();
    const httpException = ExceptionUtils.convertToHttpException(exception);

    const body = {
      ...(httpException.getResponse() as object),
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(context.getRequest()),
    };

    httpAdapter.reply(context.getResponse(), body, httpException.getStatus());
  }
}
