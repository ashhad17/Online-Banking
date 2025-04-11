import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Otp } from './entities/otp.entity';
import { User } from '../user/entities/user.entity';
import * as nodemailer from 'nodemailer';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  async sendOtp(userId: number, purpose: 'FORGOT_USERID' | 'FORGOT_PASSWORD') {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5); // 5 min expiry

    await this.otpRepo.save({
      user,
      otp_code: otp,
      purpose,
      expires_at: expiresAt,
    });

    // Simulate sending OTP via email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: `OTP for ${purpose}`,
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    return { message: 'OTP sent to registered email.' };
  }

  async verifyOtp(userId: number, otp_code: string, purpose: 'FORGOT_USERID' | 'FORGOT_PASSWORD') {
    const record = await this.otpRepo.findOne({
      where: { otp_code, user: { id: userId }, purpose, is_used: false },
      relations: ['user'],
    });

    if (!record || new Date(record.expires_at) < new Date()) {
      throw new NotFoundException('OTP is invalid or expired');
    }

    record.is_used = true;
    await this.otpRepo.save(record);
    return { message: 'OTP verified', userId: record.user.id };
  }
}
