import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AccountModule } from './account/account.module';
import { InternetBankingModule } from './internet-banking/internet-banking.module';
import { OtpModule } from './otp/otp.module';
import { PayeeModule } from './payee/payee.module';
import { TransactionModule } from './transaction/transaction.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // use false in production
    }),
    UserModule,
    AccountModule,
    InternetBankingModule,
    OtpModule,
    PayeeModule,
    TransactionModule,
    AdminModule,
    AuthModule
  ],
})
export class AppModule {}
