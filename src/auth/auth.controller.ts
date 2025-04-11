import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/create-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
async login(@Body() body: LoginAuthDto) {
  const user = await this.authService.validateUser(body.user_id, body.password);
  return this.authService.login(user);
}
}
