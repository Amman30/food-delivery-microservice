export class CreateOrderDto {
  userId: string;
  restaurantId: string;
  orderTime: Date;
  items: OrderItemDto[];
}

export class OrderItemDto {
  menuItemId: string;
  quantity: number;
}
