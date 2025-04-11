import { Injectable, NotFoundException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternetBanking } from './entities/internet-banking.entity';
import { RegisterBankingDto } from './dto/create-internet-banking.dto';
import { OtpService } from 'src/otp/otp.service';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class InternetBankingService {
  constructor(
    @InjectRepository(InternetBanking)
    private bankingRepo: Repository<InternetBanking>,
    private otpService: OtpService,
  ) {}
  async resetPassword(dto: UpdatePasswordDto) {
    // Verify OTP
    await this.otpService.verifyOtp(dto.user_id, dto.otp_code, 'FORGOT_PASSWORD');
  
    const record = await this.bankingRepo.findOne({ where: { user_id: dto.user_id } });
    if (!record) throw new NotFoundException('User not registered');
  
    record.login_password = await bcrypt.hash(dto.new_password, 10);
    record.is_locked = false;
    record.login_attempts = 0;
  
    return this.bankingRepo.save(record);
  }
  async register(dto: RegisterBankingDto) {
    const existing = await this.bankingRepo.findOne({ where: { user_id: dto.user_id } });
    if (existing) throw new BadRequestException('Already registered for internet banking');

    const loginPassword = await bcrypt.hash(dto.login_password, 10);
    const txnPassword = await bcrypt.hash(dto.transaction_password, 10);

    const record = this.bankingRepo.create({
      user_id: dto.user_id,
      login_password: loginPassword,
      transaction_password: txnPassword,
    });

    return this.bankingRepo.save(record);
  }

  async validateLogin(user_id: number, password: string) {
    const user = await this.bankingRepo.findOne({ where: { user_id } });
    if (!user) throw new NotFoundException('User not registered for banking');

    if (user.is_locked) {
      throw new UnauthorizedException('Account is locked. Reset your password.');
    }

    const isMatch = await bcrypt.compare(password, user.login_password);
    if (!isMatch) {
      user.login_attempts += 1;
      if (user.login_attempts >= 3) {
        user.is_locked = true;
      }
      await this.bankingRepo.save(user);
      throw new UnauthorizedException('Invalid credentials');
    }

    user.login_attempts = 0;
    await this.bankingRepo.save(user);

    return { message: 'Login successful' };
  }

  async resetLoginAttempts(user_id: number) {
    const user = await this.bankingRepo.findOne({ where: { user_id } });
    if (!user) throw new NotFoundException('User not found');
    user.login_attempts = 0;
    user.is_locked = false;
    return this.bankingRepo.save(user);
  }
}
