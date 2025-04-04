import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { RestaurantServiceModule } from './restaurant-service.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(RestaurantServiceModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('RESTAURANT_TCP_PORT'),
    },
  });

  const httpPort = configService.get<number>('RESTAURANT_SERVICE_PORT');
  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Restaurant Service running on HTTP: ${httpPort} and TCP: ${configService.get('RESTAURANT_TCP_PORT')}`,
  );
}
bootstrap();
