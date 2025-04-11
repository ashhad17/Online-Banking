import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/account.entity';
import { User } from '../user/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
// import { Transaction } from 'typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Account, User,Transaction])],
  controllers: [AccountController],
  providers: [AccountService],
  exports: [AccountService],
})
export class AccountModule {}
