import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthController } from './auth.controller';
// import { jwtConstants } from './constants/constants';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: "p1o2i3u4y5t6r7e8w9q0a0s9d8f7g6h5j4k3l2m1n2b3v4c5x6z7",
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}