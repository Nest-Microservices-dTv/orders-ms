import { Controller, ParseUUIDPipe } from '@nestjs/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto, PaidOrderDto } from './dto';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @MessagePattern('create_Order')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    const paymentSessions =
      await this.ordersService.createPaymentSession(order);

    return {
      order,
      paymentSessions,
    };
  }

  @MessagePattern('find_All_Orders')
  findAll(@Payload() orderPaginationDto: OrderPaginationDto) {
    return this.ordersService.findAll(orderPaginationDto);
  }

  @MessagePattern('find_One_Order')
  findOne(@Payload('id', ParseUUIDPipe) id: string) {
    return this.ordersService.findOne(id);
  }

  @MessagePattern('changeOrderStatus')
  changeStatus(@Payload() changeOrderStatusDto: ChangeOrderStatusDto) {
    return this.ordersService.changeStatus(changeOrderStatusDto);
  }
  @EventPattern('payment.succeeded')
  paidOrder(@Payload() paidOrderDto: PaidOrderDto) {
    return this.ordersService.paidOrder(paidOrderDto);
  }
}
