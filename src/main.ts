import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';
import { AUTH_PACKAGE_NAME, protobufPackage } from './auth/auth.pb';
import { HttpExceptionFilter } from './auth/filter/http-exception.filter';

const options: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: '0.0.0.0:50051',
    package: protobufPackage,

    protoPath: join(
      process.cwd(),
      'node_modules/grpc-nest-proto/proto/auth.proto',
    ),
  },
};
async function bootstrap() {
  const app: INestMicroservice = await NestFactory.createMicroservice(
    AppModule,
    options,
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  app.listen();
}
bootstrap();
