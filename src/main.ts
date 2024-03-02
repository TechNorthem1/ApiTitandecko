import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/httpException.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import rateLimit from 'express-rate-limit';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors(configCors);
  app.use(cors());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  app.useGlobalPipes(new ValidationPipe())

  app.use(
    rateLimit({
      // windowMs: 15 * 60 * 1000, // 15 minutos
      max: 100, // Límite cada IP a 100 peticiones por ventana de tiempo
      standardHeaders: true, // Devuelve la información del rate limit en los headers `RateLimit-*`
      legacyHeaders: false, // Deshabilita los headers `X-RateLimit-*`
    }),
  );

  const options = new DocumentBuilder()
    .setTitle("Titan Decko")
    .setDescription("aplicacion para el e-commerce titan decko")
    .setVersion("1.0.0")
    .addBearerAuth()
    .build();

  const document= SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document, {
    swaggerOptions: {
      filter: true
    }
  });

  await app.listen(process.env.PORT || 3002);
}
bootstrap();
