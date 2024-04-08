import { NestFactory } from '@nestjs/core';
import { ServiceAppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CustomExceptionFilter } from './filter/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(ServiceAppModule);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('SERVICE API Docs')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  app.useGlobalFilters(new CustomExceptionFilter());

  await app.listen(4000, () => {
    console.log('server listening on port 4000');
  });
}
bootstrap();
