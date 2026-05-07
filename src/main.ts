import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        /^http:\/\/localhost(:\d+)?$/,
        /^https:\/\/.*\.vercel\.app$/,
        /^https:\/\/.*\.railway\.app$/,
      ];
      if (!origin || allowedOrigins.some((regex) => regex.test(origin))) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: [
      'Content-Type',
      'Accept',
      'Authorization',
      'X-Requested-With',
      'X-HTTP-Method-Override',
      'x-auth-token',
    ],
    exposedHeaders: ['Set-Cookie', 'x-auth-token'],
    optionsSuccessStatus: 204,
  });

  app.use((req, res, next) => {
    console.log(
      `[Request] Method: ${req.method}, Path: ${req.path}, Body: ${JSON.stringify(req.body)}`,
    );
    next();
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('🎬 Movie Marketplace API')
    .setDescription('🎬 Moviea loyihasining backend API dokumentatsiyasi')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', name: 'Authorization', in: 'header' },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation: http://localhost:${port}/docs`);
}
bootstrap();

