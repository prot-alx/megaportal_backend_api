import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function startApp() {
  const startTime = process.hrtime();
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('API_PORT');

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Megaportal API')
    .setDescription('API for megaportal_v2. Made by Protopopov. A.')
    .setVersion('2.0')
    .addTag('API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  try {
    await app.listen(port);

    const endTime = process.hrtime(startTime);
    const timeInMs = endTime[0] * 1000 + endTime[1] / 1000000;

    console.log(`APP STARTED AT PORT ${port} in ${timeInMs.toFixed(2)} ms`);
  } catch (error) {
    console.log(error);
  }
}

startApp();
