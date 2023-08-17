import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { globalValidationPipe } from './pipes/global-validation.pipe';
import { Body, ValidationPipe } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  // app.useGlobalPipes(globalValidationPipe);
  await app.listen(3000);
}
bootstrap();
