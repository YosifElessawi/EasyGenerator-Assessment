import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { RequestLoggerMiddleware } from './common/middleware/request-logger.middleware';
import { validationPipe } from './common/pipes/validation.pipe';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;
  const frontendUrl = configService.get<string>('FRONTEND_URL');

  // Global Exception Filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Enable CORS
  app.enableCors({
    origin: frontendUrl,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Global prefix - exclude health check from logging
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'health', method: 0 }], // 0 is GET in RequestMethod enum
  });

  // Log unhandled promise rejections
  process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection:', reason);
  });

  // Log uncaught exceptions
  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Exception:', error.stack);
  });
  
  // Apply global middleware
  app.use(new RequestLoggerMiddleware().use.bind(new RequestLoggerMiddleware()));
  
  // Apply global validation pipe
  app.useGlobalPipes(validationPipe);

  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
