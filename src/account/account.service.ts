import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';
import { User } from '../user/entities/user.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(User) private userRepo: Repository<User>,
    // @InjectRepository(Account) private accountRepo: Repository<Account>,
    @InjectRepository(Transaction) private txnRepo: Repository<Transaction>,

  ) {}

  async createAccount(dto: CreateAccountDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) throw new NotFoundException('User not found');

    const account = this.accountRepo.create({
      user,
      account_number: this.generateAccountNumber(),
      account_type: dto.account_type,
    });

    return this.accountRepo.save(account);
  }

  async activateAccount(accountId: number) {
    const account = await this.accountRepo.findOne({ where: { id: accountId } });
    if (!account) throw new NotFoundException('Account not found');
    account.is_active = true;
    return this.accountRepo.save(account);
  }

  findAll() {
    return this.accountRepo.find({ relations: ['user'] });
  }

  private generateAccountNumber(): string {
    return '10' + Math.floor(100000000 + Math.random() * 900000000).toString();
  }
  async getSummary(accountNumber: string) {
    const account = await this.accountRepo.findOne({
      where: { account_number: accountNumber },
      relations: ['user'],
    });

    if (!account) throw new NotFoundException('Account not found');

    const transactions = await this.txnRepo.find({
      where: { sender_account: accountNumber },
      order: { created_at: 'DESC' },
      take: 5,
    });

    return {
      account_number: account.account_number,
      balance: account.balance,
      recent_transactions: transactions,
      user: account.user,
    };
  }

  async getStatement(accountNumber: string, fromDate: string, toDate: string) {
    return this.txnRepo.createQueryBuilder('txn')
      .where('txn.sender_account = :acc', { acc: accountNumber })
      .andWhere('txn.created_at BETWEEN :from AND :to', {
        from: new Date(fromDate),
        to: new Date(toDate),
      })
      .orderBy('txn.created_at', 'DESC')
      .getMany();
  }
  
}
