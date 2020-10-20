import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';

async function bootstrap () {
  const serverConfig = config.get('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  const port = serverConfig.port;
  await app.listen(port);

  logger.log(`Application start at port ${port}`);
}

bootstrap();
