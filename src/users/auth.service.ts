import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'node:crypto';
import { promisify } from 'node:util';
import { JwtService } from '@nestjs/jwt';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private JwtService: JwtService,
  ) {}

  async signUp(email: string, password: string) {
    const user = await this.userService.find(email);

    if (user)
      throw new ConflictException(
        'Email already exists',
        'User with this email already exists',
      );

    const salt = randomBytes(8).toString('hex');
    const hash = (await scrypt(password, salt, 10)) as Buffer;
    const result = salt + '.' + hash.toString('hex');

    return await this.userService.create(email, result);
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.find(email);

    if (!user)
      throw new NotFoundException(
        'No user with this email found',
        'Try with a valid email',
      );

    const [psalt, phash] = user.password.split('.');

    const hash = (await scrypt(password, psalt, 10)) as Buffer;

    if (phash !== hash.toString('hex'))
      throw new UnauthorizedException('Invalid credentials');

    const payload = {
      id: user.id,
      email: user.email,
    };

    return this.JwtService.sign(payload);
  }
}
