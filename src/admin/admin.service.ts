import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Admin } from './entities/admin.entity';
import { Account } from '../account/entities/account.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepo: Repository<Admin>,
    @InjectRepository(Account) private accountRepo: Repository<Account>
  ) {}

  async login(email: string, password: string) {
    const admin = await this.adminRepo.findOne({ where: { email } });
    if (!admin) throw new NotFoundException('Admin not found');

    const match = await bcrypt.compare(password, admin.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');

    return { message: 'Login successful', adminId: admin.id };
  }

  async getPendingAccounts() {
    return this.accountRepo.find({ where: { is_active: false }, relations: ['user'] });
  }

  async approveAccount(accountId: number) {
    const account = await this.accountRepo.findOne({ where: { id: accountId } });
    if (!account) throw new NotFoundException('Account not found');
    account.is_active = true;
    return this.accountRepo.save(account);
  }

  async rejectAccount(accountId: number) {
    const account = await this.accountRepo.findOne({ where: { id: accountId } });
    if (!account) throw new NotFoundException('Account not found');
    return this.accountRepo.remove(account); // hard delete
  }
}
