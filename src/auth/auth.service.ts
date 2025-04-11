import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InternetBanking } from '../internet-banking/entities/internet-banking.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(InternetBanking) private bankingRepo: Repository<InternetBanking>,
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService
  ) {}

  async validateUser(user_id: number, password: string) {
    const banking = await this.bankingRepo.findOne({
      where: { user_id },
      relations: ['user'],
    });
  
    if (!banking) throw new NotFoundException('User not registered for internet banking');
  
    if (banking.is_locked) {
      throw new UnauthorizedException('Account is locked due to failed attempts.');
    }
  
    const isMatch = await bcrypt.compare(password, banking.login_password);
    if (!isMatch) {
      banking.login_attempts += 1;
      if (banking.login_attempts >= 3) {
        banking.is_locked = true;
      }
      await this.bankingRepo.save(banking);
      throw new UnauthorizedException('Invalid credentials');
    }
  
    banking.login_attempts = 0;
    await this.bankingRepo.save(banking);
  
    return banking.user; // ✅ Make sure this is valid
  }

  async login(user: User) {
    if (!user) throw new UnauthorizedException('Login failed');

  const payload = { sub: user.id, email: user.email };
  return {
    access_token: this.jwtService.sign(payload),
  };
  }
}
