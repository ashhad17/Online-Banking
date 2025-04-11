import { Module } from '@nestjs/common';
import { InternetBankingService } from './internet-banking.service';
import { InternetBankingController } from './internet-banking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InternetBanking } from './entities/internet-banking.entity';
import { OtpModule } from 'src/otp/otp.module';

@Module({
  imports: [TypeOrmModule.forFeature([InternetBanking]),
  OtpModule,],
  controllers: [InternetBankingController],
  providers: [InternetBankingService],
})
export class InternetBankingModule {}
