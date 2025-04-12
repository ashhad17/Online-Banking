import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { PayeeService } from './payee.service';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// @UseGuards(JwtAuthGuard)
@UseGuards(JwtAuthGuard)
@Controller('payees')
export class PayeeController {
  constructor(private readonly payeeService: PayeeService) {}

  @Post()
  add(@Body() dto: CreatePayeeDto) {
    return this.payeeService.create(dto);
  }

  @Get()
  getPayees(@Query('user_id') userId: number) {
    return this.payeeService.findAll(userId);
  }
}
