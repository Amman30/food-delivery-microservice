import {
  Restaurant,
  DeliveryAgentRating,
  User,
  Order,
  DeliveryAgent,
} from '@app/database';
import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager, In } from 'typeorm';
import { CreateOrderDto } from './dtos/create-order.dto';
import { CreateRatingDto } from './dtos/create-rating.dto';
import { MenuItem } from '@app/database/entities/restaurant/restaurant-items.entity';

@Injectable()
export class UserServiceService {
  private readonly logger = new Logger(UserServiceService.name);

  constructor(
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(DeliveryAgentRating)
    private ratingRepository: Repository<DeliveryAgentRating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(DeliveryAgent)
    private deliveryAgentRepository: Repository<DeliveryAgent>,
    private readonly entityManager: EntityManager,
  ) {}

  async getAvailableRestaurants(datetime: Date): Promise<Restaurant[]> {
    try {
      const dayOfWeek = datetime.getDay();
      const time = datetime.toTimeString().substring(0, 8);

      return await this.restaurantRepository
        .createQueryBuilder('restaurant')
        .innerJoinAndSelect('restaurant.operatingHours', 'operatingHours')
        .where('operatingHours.dayOfWeek = :day', { day: dayOfWeek })
        .andWhere(
          'operatingHours.openTime <= :time AND operatingHours.closeTime > :time',
          { time },
        )
        .cache(30000)
        .getMany();
    } catch (error) {
      this.logger.error(
        `Failed to fetch available restaurants: ${error.message}`,
      );
      throw new InternalServerErrorException('Could not retrieve restaurants');
    }
  }

  async placeOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.entityManager.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { id: createOrderDto.userId },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const restaurant = await queryRunner.manager.findOne(Restaurant, {
        where: { id: createOrderDto.restaurantId },
        relations: ['operatingHours'],
        lock: { mode: 'pessimistic_read' },
      });
      if (!restaurant) {
        throw new NotFoundException('Restaurant not found');
      }

      const orderTime = new Date(createOrderDto.orderTime);
      const isAvailable = restaurant.operatingHours.some((hour) => {
        const currentTime = orderTime.toTimeString().substring(0, 8);
        return (
          hour.dayOfWeek === orderTime.getDay() &&
          hour.openTime <= currentTime &&
          hour.closeTime > currentTime
        );
      });
      if (!isAvailable) {
        throw new BadRequestException(
          'Restaurant is not available at the requested time',
        );
      }

      const menuItemIds = createOrderDto.items.map((item) => item.menuItemId);
      const menuItems = await queryRunner.manager.find(MenuItem, {
        where: { id: In(menuItemIds) },
      });
      const uniqueMenuItemIds = new Set(menuItemIds);
      if (menuItems.length !== uniqueMenuItemIds.size) {
        throw new NotFoundException('One or more menu items not found');
      }

      const menuItemsMap = new Map<string, MenuItem>();
      menuItems.forEach((menuItem) => {
        menuItemsMap.set(menuItem.id.toString(), menuItem);
      });

      const totalAmount = createOrderDto.items.reduce((acc, item) => {
        const menuItem = menuItemsMap.get(item.menuItemId);
        return acc + menuItem.price * item.quantity;
      }, 0);

      const order = this.orderRepository.create({
        user: { id: createOrderDto.userId },
        restaurant: { id: createOrderDto.restaurantId },
        orderDate: orderTime,
        orderStatus: 'PENDING',
        items: createOrderDto.items.map((item) => ({
          quantity: item.quantity,
          item: { id: item.menuItemId },
          order: order,
        })),
        totalAmount,
      });

      const savedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Order placement failed: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to place order');
    } finally {
      await queryRunner.release();
    }
  }

  async createRating(
    createRatingDto: CreateRatingDto,
  ): Promise<DeliveryAgentRating> {
    try {
      const { orderId, userId, deliveryAgentId, ratingValue, comment } =
        createRatingDto;

      if (ratingValue < 1 || ratingValue > 5) {
        throw new BadRequestException('Rating must be between 1 and 5');
      }

      const [user, order, deliveryAgent] = await Promise.all([
        this.userRepository.findOneBy({ id: userId }),
        this.orderRepository.findOneBy({ id: orderId }),
        this.deliveryAgentRepository.findOneBy({ id: deliveryAgentId }),
      ]);

      if (!user) throw new NotFoundException('User not found');
      if (!order) throw new NotFoundException('Order not found');
      if (!deliveryAgent)
        throw new NotFoundException('Delivery agent not found');

      const existingRating = await this.ratingRepository.findOne({
        where: { order: { id: orderId } },
      });

      if (existingRating) {
        throw new BadRequestException('Rating already exists for this order');
      }

      const rating = this.ratingRepository.create({
        ratingValue,
        comment,
        user,
        order,
        deliveryAgent,
      });

      return await this.ratingRepository.save(rating);
    } catch (error) {
      this.logger.error(
        `Rating creation failed: ${error.message}`,
        error.stack,
      );

      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to create rating');
    }
  }

  getHello(): string {
    return 'Hello World! from user service';
  }
}
