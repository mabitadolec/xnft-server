import { config } from 'dotenv';
config({ path: `${__dirname}/../${process.env.NODE_ENV}.env` });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //enabe cors
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
