import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import ValidationPipes from './core/config/validation-pipes';
import { AllExceptionFilter } from './core/exceptions/exception.filter';

// To allow parsing BigInt to JSON
(BigInt.prototype as any).toJSON = function () {
  return Number(this.toString());
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Course Work')
    .setDescription('The Course Work API description')
    .setVersion('0.1')
    .build();

  app.useGlobalPipes(ValidationPipes.validationPipe);
  app.useGlobalFilters(new AllExceptionFilter(app.get(HttpAdapterHost)));
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      `${process.env.FRONTEND_URL}:3000`,
      `${process.env.FRONTEND_URL}:80`,
    ],
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(process.env.BACKEND_INTERNAL_PORT ?? 8000);
}
bootstrap();
