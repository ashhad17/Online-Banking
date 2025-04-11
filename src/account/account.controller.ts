import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';
// @UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token') // 👈 matches addBearerAuth() key
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() dto: CreateAccountDto) {
    return this.accountService.createAccount(dto);
  }

  @Patch(':id/activate')
  activate(@Param('id') id: number) {
    return this.accountService.activateAccount(+id);
  }

  @Get()
  findAll() {
    return this.accountService.findAll();
  }
  @Get('summary')
getSummary(@Query('account') accountNumber: string) {
  return this.accountService.getSummary(accountNumber);
}

@Get('statement')
getStatement(
  @Query('account') accountNumber: string,
  @Query('from') fromDate: string,
  @Query('to') toDate: string,
) {
  return this.accountService.getStatement(accountNumber, fromDate, toDate);
}
}
