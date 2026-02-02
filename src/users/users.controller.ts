import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserResponseDto } from './dtos/user-response.dto';

@Controller('auth')
@Serialize(UserResponseDto)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signUp')
  async signUp(@Body() body: CreateUserDto) {
    await this.usersService.create(body.email, body.password);
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
