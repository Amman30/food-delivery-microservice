import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { UserServiceModule } from './user-service.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);
  const configService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('User Service API')
    .setDescription('API documentation for the user service')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api', app, document);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('USER_TCP_PORT'),
    },
  });

  const httpPort = configService.get<number>('USER_SERVICE_PORT');
  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `User Service running on HTTP: ${httpPort} and TCP: ${configService.get('USER_TCP_PORT')}`,
  );
}
bootstrap();
