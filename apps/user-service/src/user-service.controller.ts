import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserServiceService } from './user-service.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateRatingDto } from './dtos/create-rating.dto';

@ApiTags('User Service') // Groups endpoints under 'User Service' in Swagger UI
@Controller()
export class UserServiceController {
  constructor(private readonly userServiceService: UserServiceService) {}

  @Get()
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: 200, description: 'Service is running' })
  getHello(): string {
    return this.userServiceService.getHello();
  }

  @Get('restaurants/available')
  @ApiOperation({ summary: 'Get available restaurants' })
  @ApiResponse({ status: 200, description: 'List of available restaurants' })
  async getAvailableRestaurants(@Query('datetime') datetime: string) {
    return await this.userServiceService.getAvailableRestaurants(
      new Date(datetime),
    );
  }

  @Post('orders')
  @ApiOperation({ summary: 'Place an order' })
  @ApiResponse({ status: 201, description: 'Order placed successfully' })
  @ApiResponse({ status: 400, description: 'Invalid request data' })
  @ApiBody({ type: CreateOrderDto })
  async placeOrder(@Body() createOrderDto: CreateOrderDto) {
    return await this.userServiceService.placeOrder(createOrderDto);
  }

  @Post('ratings')
  @ApiOperation({ summary: 'Create a rating for a restaurant' })
  @ApiResponse({ status: 201, description: 'Rating created successfully' })
  @ApiBody({ type: CreateRatingDto })
  async createRating(@Body() createRatingDto: CreateRatingDto) {
    return await this.userServiceService.createRating(createRatingDto);
  }
}
