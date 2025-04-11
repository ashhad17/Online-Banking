import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Account } from '../account/entities/account.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Account])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
