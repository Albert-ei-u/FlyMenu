import { Body, Controller, Get, Header, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../../common/auth/auth.guard';
import { CurrentUser } from '../../common/auth/current-user.decorator';
import { CurrentUser as CurrentUserType } from '../../common/auth/current-user';

@ApiTags('Orders')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all orders', description: 'Retrieve all orders across all restaurants ordered by latest first.' })
  findAll(@CurrentUser() user: CurrentUserType) {
    return this.ordersService.findAll(user);
  }

  @Get('export/csv')
  @Header('Content-Type', 'text/csv')
  @Header('Content-Disposition', 'attachment; filename="orders.csv"')
  @ApiOperation({ summary: 'Export orders as CSV', description: 'Download all orders as a CSV file for reporting.' })
  exportCsv(@CurrentUser() user: CurrentUserType) {
    return this.ordersService.exportCsv(user);
  }

  @Post()
  @ApiOperation({ summary: 'Place order', description: 'Create a new order with line items. Automatically generates an order number and PENDING tracking event.' })
  create(@Body() body: CreateOrderDto, @CurrentUser() user: CurrentUserType) {
    return this.ordersService.create(body, user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order', description: 'Fetch full order details including items and tracking event timeline.' })
  @ApiParam({ name: 'id', description: 'Order ID (CUID).' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status', description: 'Update order status (PENDING → CONFIRMED → PREPARING → READY → COMPLETED). Emits a real-time Socket.io event.' })
  @ApiParam({ name: 'id', description: 'Order ID (CUID).' })
  @ApiBody({ schema: { type: 'object', properties: { status: { type: 'string', example: 'PREPARING', enum: ['PENDING','CONFIRMED','PREPARING','READY','COMPLETED','CANCELLED'] } }, required: ['status'] } })
  updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }
}

