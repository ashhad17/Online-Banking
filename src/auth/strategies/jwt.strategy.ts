import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: "p1o2i3u4y5t6r7e8w9q0a0s9d8f7g6h5j4k3l2m1n2b3v4c5x6z7",
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}