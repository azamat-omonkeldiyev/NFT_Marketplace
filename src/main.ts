import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('NFT Marketplace')
    .setDescription('NFT Marketplace API description')
    .setVersion('1.0.0')
    .addSecurityRequirements('bearer', ['bearer'])
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors({
    origin: '*',
    methods: ['POST', 'PATCH','PUT', 'GET', 'DELETE']
  });

  app.useGlobalPipes(new ValidationPipe({whitelist:true,transform:true}));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
