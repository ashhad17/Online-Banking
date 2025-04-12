import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from './entities/admin.entity';
import { Account } from '../account/entities/account.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, Account,JwtService]),
  JwtModule.register({     
      secret: "b9ad1d4f3c41da8ca2d88d54648fd42ec9bfc032506d6d9df0ff4936ca71ab0fba71eb3d6b668f3d211ebc1fdea9eab0c7f2314dc16fdee4c2333218761467f5bfd567709a4bc65611b9c6907f035bb9bb294dd34571da6728472f47639e4deedc38dee511bd0f4a40eb9739d8a684b3b1bada5667df387f22ff88225ac8d02d7b70773e31a6a27535db2c44956bc75a389eb266ae3c1aff8c5229ec74ff045d179a0214aa043225ba5a17016c5aa3bb288f71a020eb17d01b90b35d870c9d6325fb6fc9b9bee9daf6e1b326248fbcedfd6be39364e6b2e10b64bc843535c7775e90eef7ce9def9234144dc624262518f796a9bed2defb0a7c2a916e6d472808", // ideally use config service here
      signOptions: { expiresIn: '60m' },
    })],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
