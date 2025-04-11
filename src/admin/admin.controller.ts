import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminLoginDto } from './dto/create-admin.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
// @UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('login')
  login(@Body() dto: AdminLoginDto) {
    return this.adminService.login(dto.email, dto.password);
  }

  @Get('accounts/pending')
  getPendingAccounts() {
    return this.adminService.getPendingAccounts();
  }

  @Patch('accounts/:id/approve')
  approve(@Param('id') id: number) {
    return this.adminService.approveAccount(id);
  }

  @Patch('accounts/:id/reject')
  reject(@Param('id') id: number) {
    return this.adminService.rejectAccount(id);
  }
}
