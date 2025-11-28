// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  console.log('MONGODB_URI:', process.env.MONGODB_URI); // ✅ Debug line

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  console.log(
    `Application is running on: http://localhost:${process.env.PORT || 3000}`,
  );
}
bootstrap();
