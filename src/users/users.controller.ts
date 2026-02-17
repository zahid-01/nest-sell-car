import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserResponseDto } from './dtos/user-response.dto';
import { AuthService } from './auth.service';
import type { Response } from 'express';
import { currentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';

@Controller('auth')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('/signUp')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body.email, body.password);
  }

  @Post('/sign-in')
  async signIn(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signIn(body.email, body.password);

    res.cookie('JWT', token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000,
    });

    return 'Sign IN';
  }

  @Get('/whoami')
  @UseInterceptors(CurrentUserInterceptor)
  whoAmI(@currentUser('zahid') user: string) {
    return user;
  }

  @Get('/allUsers')
  async allUsers() {
    return await this.usersService.findAll();
  }

  @Get('/:id')
  async findById(@Param('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Patch('/:id')
  async updateOne(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return await this.usersService.update(id, body);
  }

  @Delete('/:id')
  async deleteOne(@Param('id') id: number) {
    return await this.usersService.remove(id);
  }
}
