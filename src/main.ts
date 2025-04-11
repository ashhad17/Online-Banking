import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
// import { Admin } from 'typeorm';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as bcrypt from 'bcrypt';
import { Admin } from './admin/entities/admin.entity';
import { ValidationPipe } from '@nestjs/common';

// import {bcrypt}
async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  // ✅ Automatically validate DTOs
  const config = new DocumentBuilder()
  .setTitle('Online Banking API')
  .setDescription('All secured endpoints require Bearer JWT token')
  .setVersion('1.0')
  .addBearerAuth(
    {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
      in: 'header',
    },
    'access-token' // 🔑 This must match below
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api-docs', app, document);

// SwaggerModule.setup('api-docs', app, document);
const adminRepo = app.get(getRepositoryToken(Admin));
const exists = await adminRepo.findOne({ where: { email: 'admin@bank.com' } });
if (!exists) {
  const password = await bcrypt.hash('admin123', 10);
  await adminRepo.save({ email: 'admin@bank.com', password });
}
  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
