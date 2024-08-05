import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function startApp() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('API_PORT');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Megaportal API')
    .setDescription('This API for the lesson')
    .setVersion('2.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  try {
    await app.listen(port);
    console.log(`APP STARTED AT PORT ${port}`);
  } catch (error) {
    console.log(error);
  }
}
startApp();
