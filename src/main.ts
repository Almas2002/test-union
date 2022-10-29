import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MyValidationPipe } from './pipes/MyValidation.pipe';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle("Union")
    .setDescription("Documentation for REST API")
    .setVersion("1.0.0")
    .addTag("Union")
    .addBearerAuth(
      undefined,
      'defaultBearerAuth',
    )
    .build();
   app.use(cookieParser())
  const documentation = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup("/api/docs",app,documentation)
  app.useGlobalPipes(new MyValidationPipe());
  await app.listen(3002);
}
bootstrap();
