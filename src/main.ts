import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  try {
    console.log('Starting NestJS bootstrap...');
    
    const app = await NestFactory.create(AppModule);
    console.log('NestJS app instance created.');

    app.enableCors({
      origin: '*',
      credentials: true,
    });
    console.log('CORS enabled.');

    const config = new DocumentBuilder()
      .setTitle('Todo App')
      .setDescription('API docs for your NestJS ToDo app')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    SwaggerModule.setup('api', app, SwaggerModule.createDocument(app, config));
    console.log('Swagger set up at /api.');

    const port = process.env.PORT || 3000;
    console.log(`Listening on port ${port}...`);
    await app.listen(port, '0.0.0.0');

    console.log(`NestJS app is listening on port ${port}.`);
  } catch (error) {
    console.error('Error during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap();
