import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../entities/User';
import { Repository } from 'typeorm';
import { UserDto } from './type';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private readonly userRepo: Repository<User>;

  async getAllUsers(): Promise<{ data: UserDto[]; count: number }> {
    const users = await this.userRepo.findAndCount({
      order: {
        id: 'ASC',
      },
    });

    return {
      data: users[0].map((user) => this.mapToUserDto(user)),
      count: users[1],
    };
  }

  async getUsersByHomeId(
    homeId: string,
  ): Promise<{ data: UserDto[]; count: number }> {
    const users = await this.userRepo.findAndCount({
      where: {
        userHomeMaps: {
          home: {
            uniqueId: homeId,
          },
        },
      },
      relations: ['userHomeMaps'],
    });

    return {
      data: users[0].map((user) => this.mapToUserDto(user)),
      count: users[1],
    };
  }

  async getUser(uniqueId: string): Promise<UserDto> {
    const user = await this.userRepo.findOne({
      where: {
        uniqueId,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.mapToUserDto(user);
  }

  mapToUserDto(user: User): UserDto {
    return {
      id: user.id,
      uniqueId: user.uniqueId,
      username: user.username,
      email: user.email,
    };
  }
}
