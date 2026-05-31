import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Swagger / OpenAPI documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('FlyMenu API')
    .setDescription(
      'REST API for the FlyMenu restaurant management platform. ' +
      'Covers authentication, restaurant management, menus, orders, reservations, ' +
      'staff, clients, operations, analytics, real-time notifications, and super-admin platform controls.',
    )
    .setVersion('1.0')
    .setContact('FlyMenu Team', '', 'support@flymenu.app')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Enter your JWT access token' },
      'access-token',
    )
    .addTag('Health', 'API health check')
    .addTag('Auth', 'Registration, login, JWT sessions, and password reset')
    .addTag('Users', 'Platform user identities, roles, and account management')
    .addTag('Restaurants', 'Restaurant profiles, discovery, and configuration')
    .addTag('Restaurant Applications', 'Partner onboarding, document review, and approvals')
    .addTag('Menu', 'Menu categories, items, allergens, and nutrition')
    .addTag('Orders', 'Order placement, kitchen flow, and live tracking')
    .addTag('Reservations', 'Table bookings, availability, and QR codes')
    .addTag('Tables', 'Restaurant table management')
    .addTag('Staff', 'Employee directory and performance tracking')
    .addTag('Clients', 'Restaurant CRM — client profiles, spend, and loyalty')
    .addTag('Customers', 'Customer platform accounts and profiles')
    .addTag('Operations', 'Kitchen load, operational incidents, and resolutions')
    .addTag('Notifications', 'In-app alerts with real-time push via Socket.io')
    .addTag('Analytics', 'Sales metrics, revenue trends, and dashboard snapshots')
    .addTag('Platform', 'Super-admin dashboards, approvals, and system status')
    .addTag('Settings', 'Restaurant notification preferences and profile configuration')
    .addTag('Media', 'File uploads (images, documents) via Multer local storage')
    .addTag('Favorites', 'Customer saved restaurants')
    .addTag('Reviews', 'Customer ratings and feedback')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'FlyMenu API Docs',
  });

  const port = config.get<number>('PORT', 4000);
  await app.listen(port);
  console.log(`\n🚀 FlyMenu API running at: http://localhost:${port}/${apiPrefix}`);
  console.log(`📖 Swagger Docs available at: http://localhost:${port}/api/docs\n`);
}

void bootstrap();
