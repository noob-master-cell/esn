// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable Gzip compression
  app.use(compression());

  // Security Headers with Helmet
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding for GraphQL Playground
  }));

  // Serve uploaded files
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // CORS Configuration - Restrictive for production
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? [
      process.env.FRONTEND_URL || 'https://yourdomain.com',
      // Add your production domains here
    ]
    : [
      'http://localhost:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
      'http://127.0.0.1:5174',
      'http://0.0.0.0:5173',
      // Add your local IP for mobile testing
      process.env.LOCAL_IP ? `http://${process.env.LOCAL_IP}:5173` : null,
    ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      // Check if origin is allowed or if it's a Vercel preview deployment
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        console.warn(`⚠️  CORS: Blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'apollo-require-preflight'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 4000;

  // Bind to all network interfaces
  try {
    await app.listen(port, '0.0.0.0');
    console.log('✅ Server started successfully');
    console.log(`🚀 Server running on: http://0.0.0.0:${port}`);
    console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
    console.log(`🔒 Security headers: Enabled`);
    console.log(`🚦 Rate limiting: Enabled (100 req/min)`);
    console.log(`🌐 CORS: ${process.env.NODE_ENV === 'production' ? 'Restrictive' : 'Development'}`);
  } catch (error) {
    console.error('❌ Server startup failed:', error.message);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ Bootstrap failed:', error.message);
  process.exit(1);
});
