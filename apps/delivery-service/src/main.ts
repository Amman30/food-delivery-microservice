import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { DeliveryServiceModule } from './delivery-service.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(DeliveryServiceModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get<number>('DELIVERY_TCP_PORT'),
    },
  });

  const httpPort = configService.get<number>('DELIVERY_SERVICE_PORT');
  await app.startAllMicroservices();
  await app.listen(httpPort);
  console.log(
    `Delivery Service running on HTTP: ${httpPort} and TCP: ${configService.get('DELIVERY_TCP_PORT')}`,
  );
}
bootstrap();
