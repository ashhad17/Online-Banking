import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { InitiateTransactionDto } from './dto/initiate-transaction.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// @UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  transfer(@Body() dto: InitiateTransactionDto) {
    return this.transactionService.transfer(dto);
  }
  @Get('report/monthly')
monthlyReport(
  @Query('account') account: string,
  @Query('month') month: number,
  @Query('year') year: number,
) {
  return this.transactionService.getMonthlyReport(account, month, year);
}

@Get('report/quarterly')
quarterlyReport(
  @Query('account') account: string,
  @Query('quarter') quarter: number,
  @Query('year') year: number,
) {
  return this.transactionService.getQuarterlyReport(account, quarter, year);
}

  @Get()
  history(@Query('account') account: string) {
    return this.transactionService.findBySender(account);
  }
}
