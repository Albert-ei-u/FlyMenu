import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'node:path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);
  const apiPrefix = config.get<string>('API_PREFIX', 'api/v1');
  const uploadsDir = config.get<string>('UPLOADS_DIR', 'uploads');
  const publicUploadsPath = config.get<string>('PUBLIC_UPLOADS_PATH', '/uploads');

  app.setGlobalPrefix(apiPrefix);
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useStaticAssets(join(process.cwd(), uploadsDir), {
    prefix: publicUploadsPath,
  });

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
}

void bootstrap();
