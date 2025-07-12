// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS with your specific IP
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://0.0.0.0:5173',
      'http://192.168.0.197:5173', // Your specific IP
      // Allow all for development
      '*',
    ],
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT || 4000;

  // Bind to all network interfaces
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Server running on http://0.0.0.0:${port}`);
  console.log(`📊 GraphQL Playground: http://192.168.0.197:${port}/graphql`);
  console.log(`📱 Mobile access: http://192.168.0.197:${port}/graphql`);
}
bootstrap();
