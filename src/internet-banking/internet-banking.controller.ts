import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { InternetBankingService } from './internet-banking.service';
import { RegisterBankingDto } from './dto/create-internet-banking.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { LoginBankingDto } from './dto/login-banking.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
@Controller('internet-banking')
export class InternetBankingController {
  constructor(private readonly service: InternetBankingService) {}

  @Post('register')
  register(@Body() dto: RegisterBankingDto) {
    return this.service.register(dto);
  }
  @Post('reset-password')
  resetPassword(@Body() dto: UpdatePasswordDto) {
    return this.service.resetPassword(dto);
  }
  @Post('login')
  login(@Body() body:LoginBankingDto) {
    return this.service.validateLogin(body.user_id, body.password);
  }

  @Post('unlock')
  unlock(@Body() body: { user_id: number }) {
    return this.service.resetLoginAttempts(body.user_id);
  }
}
