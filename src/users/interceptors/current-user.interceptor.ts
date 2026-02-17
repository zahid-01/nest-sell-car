import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../users.service';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async intercept(
    context: ExecutionContext,
    handler: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const token = request.cookies.JWT;
    if (!token) throw new UnauthorizedException('Login to continue');

    request.user = await this.jwtService.verify(token);

    return handler.handle();
  }
}
