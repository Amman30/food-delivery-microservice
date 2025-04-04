import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  environment: process.env.NODE_ENV || 'development',
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  services: {
    user: parseInt(process.env.USER_SERVICE_PORT),
    restaurant: parseInt(process.env.RESTAURANT_SERVICE_PORT),
    delivery: parseInt(process.env.DELIVERY_SERVICE_PORT),
  },
}));
