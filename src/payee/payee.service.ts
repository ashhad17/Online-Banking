import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payee } from './entities/payee.entity';
import { CreatePayeeDto } from './dto/create-payee.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class PayeeService {
  constructor(
    @InjectRepository(Payee) private payeeRepo: Repository<Payee>,
    @InjectRepository(User) private userRepo: Repository<User>,
  ) {}

  async create(dto: CreatePayeeDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) {
      throw new Error('User not found');
    }
    const payee = this.payeeRepo.create({ ...dto, user});
    return this.payeeRepo.save(payee);
  }

  findAll(userId: number) {
    return this.payeeRepo.find({ where: { user: { id: userId } } });
  }
}
