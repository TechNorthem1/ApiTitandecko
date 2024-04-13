import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/httpException.filter';
import { TimeOutInterceptor } from './common/interceptors/timeout.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cors from 'cors';
import rateLimit from 'express-rate-limit';
import { configCors } from './common/configs/cors-config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(configCors);
  app.use(cors());
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalInterceptors(new TimeOutInterceptor());
  app.useGlobalPipes(new ValidationPipe());


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
