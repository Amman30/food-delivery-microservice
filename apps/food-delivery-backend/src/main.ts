import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('CORS_ORIGINS').split(','),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('GATEWAY_PORT'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('GATEWAY_PORT'));
  console.log(
    `API Gateway running on port ${configService.get('GATEWAY_PORT')}`,
  );
}
bootstrap();
