import { Module } from '@nestjs/common';
import { PayeeService } from './payee.service';
import { PayeeController } from './payee.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payee } from './entities/payee.entity';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Payee, User])], // ✅ This is key
  providers: [PayeeService],
  controllers: [PayeeController],
  exports: [PayeeService], // optional, if needed outside
})
export class PayeeModule {}
