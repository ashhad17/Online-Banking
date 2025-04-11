import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DataSource, Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { InitiateTransactionDto } from './dto/initiate-transaction.dto'; 
import * as nodemailer from 'nodemailer';
import { Account } from 'src/account/entities/account.entity';
@Injectable()
export class TransactionService {
  constructor(@InjectRepository(Transaction) private txnRepo: Repository<Transaction>,
  @InjectRepository(Account) private accRepo:Repository<Account>,
  private dataSource: DataSource,) {}

  
  // async transfer(dto: InitiateTransactionDto) {
  //   const { sender_account, receiver_account, amount, mode } = dto;
  
  //   // 1. Create the transaction object
  //   const transaction = this.txnRepo.create({
  //     sender_account,
  //     receiver_account,
  //     amount,
  //     mode,
  //     status: 'PENDING',
  //   });
  
  //   // 2. Find sender account
  //   const senderAccount = await this.accRepo.findOne({
  //     where: { account_number: sender_account },
  //     relations: ['user'],
  //   });
  //   const receiverAccount = await this.accRepo.findOne({
  //     where: { account_number: receiver_account },
  //     relations: ['user']
  //   });
  
  //   if (!senderAccount || !senderAccount.user) {
  //     throw new Error('Sender account not found');
  //   }
  
  //   // 3. Check balance
  //   if (senderAccount.balance < amount) {
  //     transaction.status = 'FAILED';
  //     await this.txnRepo.save(transaction);
  //     throw new Error('Insufficient balance');
  //   }
  
  //   // 4. Deduct balance from sender
  //   senderAccount.balance -= amount;
  
  //   // 5. Check if receiver exists
    
  
  //   if (receiverAccount) {
      
  //     receiverAccount.balance += amount;
  //     await this.accRepo.save(receiverAccount);
      
  //   } else {
  //     console.log('Receiver is external or not registered in system');
  //   }
  
  //   // 6. Save updated sender balance
  //   await this.accRepo.save(senderAccount);
    
  
  //   // 7. Save transaction as success
  //   transaction.status = 'SUCCESS';
  //   const savedTxn = await this.txnRepo.save(transaction);
  
  //   // 8. Send email notification to sender
  //   try {
  //     await this.notifyEmail(senderAccount.user.email, savedTxn);
  //   } catch (err) {
  //     console.warn('Failed to send email:', err.message);
  //   }
  
  //   return savedTxn;
  // }
  async transfer(dto: InitiateTransactionDto) {
    const { sender_account, receiver_account, amount, mode } = dto;
  
    return await this.dataSource.transaction(async manager => {
      // 1. Create a transaction entity (not yet saved)
      const transaction = this.txnRepo.create({
        sender_account,
        receiver_account,
        amount,
        mode,
        status: 'PENDING',
      });
  
      // 2. Load sender account with user relation
      const senderAccount = await manager.findOne(Account, {
        where: { account_number: sender_account },
        relations: ['user'],
      });
  
      if (!senderAccount || !senderAccount.user) {
        throw new Error('Sender account not found');
      }
  
      // 3. Check balance
      if (senderAccount.balance < amount) {
        transaction.status = 'FAILED';
        await manager.save(transaction);
        throw new Error('Insufficient balance');
      }
  
      // 4. Deduct balance from sender
      senderAccount.balance = Number(senderAccount.balance) - Number(amount);
      await manager.save(senderAccount);
  
      // 5. Load and credit receiver if internal
      const receiverAccount = await manager.findOne(Account, {
        where: { account_number: receiver_account },
      });
  
      if (receiverAccount) {
        // Explicitly convert to numbers to avoid string concatenation
        receiverAccount.balance = Number(receiverAccount.balance) + Number(amount);
        await manager.save(receiverAccount);
      } else {
        console.log('Receiver account not found – external assumed');
      }
  
      // 6. Mark transaction success
      transaction.status = 'SUCCESS';
      const savedTxn = await manager.save(transaction);
  
      // 7. Notify sender (outside transaction for speed)
      try {
        await this.notifyEmail(senderAccount.user.email, savedTxn);
      } catch (err) {
        console.warn('Email notification failed:', err.message);
      }
  
      return savedTxn;
    });
  }
  
  
  async getMonthlyReport(accountNumber: string, month: number, year: number) {
    const from = new Date(year, month - 1, 1);
    const to = new Date(year, month, 0, 23, 59, 59); // End of month
  
    return this.txnRepo.find({
      where: {
        sender_account: accountNumber,
        created_at: Between(from, to),
      },
      order: { created_at: 'DESC' },
    });
  }
  async getQuarterlyReport(accountNumber: string, quarter: number, year: number) {
    const startMonth = (quarter - 1) * 3;
    const from = new Date(year, startMonth, 1);
    const to = new Date(year, startMonth + 3, 0, 23, 59, 59); // End of quarter
  
    return this.txnRepo.find({
      where: {
        sender_account: accountNumber,
        created_at: Between(from, to),
      },
      order: { created_at: 'DESC' },
    });
  }

  async notifyEmail(toEmail: string, txn: Transaction) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: toEmail,
      subject: 'Transaction Alert',
      text: `INR ${txn.amount} was sent via ${txn.mode} to ${txn.receiver_account}.`,
    });
  }
  findBySender(account: string) {
    return this.txnRepo.find({ where: { sender_account: account } });
  }
}
