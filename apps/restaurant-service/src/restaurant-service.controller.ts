import { Restaurant, Order } from '@app/database';
import { MenuItem } from '@app/database/entities/restaurant/restaurant-items.entity';
import { Controller, Patch, Param, Body, Put } from '@nestjs/common';
import { RestaurantServiceService } from './restaurant-service.service';
import { UpdateMenuItemDto } from './dtos/update-menu-item.dto';

@Controller('restaurants')
export class RestaurantServiceController {
  constructor(private readonly restaurantService: RestaurantServiceService) {}

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() { isOnline }: { isOnline: boolean },
  ): Promise<Restaurant> {
    return this.restaurantService.setRestaurantStatus(id, isOnline);
  }

  @Patch('menu-items/:id')
  async updateMenuItem(
    @Param('id') id: string,
    @Body() update: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return await this.restaurantService.updateMenuItem(+id, update);
  }

  @Put('orders/:id/process')
  async processOrder(
    @Param('id') id: string,
    @Body() { accept }: { accept: boolean },
  ): Promise<Order> {
    return await this.restaurantService.processOrder(id, accept);
  }
}
