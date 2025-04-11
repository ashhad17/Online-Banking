import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        console.log('[JwtAuthGuard] Checking JWT...'); // ✅ Log if it's called
        return super.canActivate(context);
      }
}
