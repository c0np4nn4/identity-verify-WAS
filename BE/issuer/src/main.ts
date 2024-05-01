import { NestFactory } from '@nestjs/core';
import { IssuerAppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './filter/exception.filter';
import { IssuerAPIService } from './issuer/issuer-api.service';

async function bootstrap() {
  const app = await NestFactory.create(IssuerAppModule);

  if (process.env.RESET_COUNTER === 'true') {
    const counterService = app.get(IssuerAPIService);
    await counterService.resetCounter();
  }

  app.enableCors({
    origin: ['http://localhost:8081', 'http://holder:8081'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('ISSUER API Docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(8082);
}
bootstrap();
