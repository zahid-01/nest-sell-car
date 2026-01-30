import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity) private repo: Repository<UserEntity>,
  ) {}

  async create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    await this.repo.save(user);
  }

  async findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  async update(id: number, attr: Partial<UserEntity>) {
    const user = await this.repo.findOneBy({ id });

    if (!user)
      return new NotFoundException('No user with that id found', 'No user');

    Object.assign(user, attr);

    await this.repo.save(user);
    return user;
  }

  async remove(id: number) {
    const user = await this.repo.findOneBy({ id });

    if (!user)
      return new NotFoundException('No user with that id found', 'No user');

    await this.repo.remove(user);
  }
}
