import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Home } from '../../entities/Home';
import { Repository } from 'typeorm';
import { UserHomeMap } from '../../entities/UserHomeMap';

@Injectable()
export class HomeService {
  @InjectRepository(Home)
  private readonly homeRepo: Repository<Home>;

  @InjectRepository(UserHomeMap)
  private readonly userHomeMapRepo: Repository<UserHomeMap>;

  async getAllHomes(): Promise<{ data: Home[]; count: number }> {
    const homes = await this.homeRepo.findAndCount({
      order: {
        id: 'ASC',
      },
    });

    return {
      data: homes[0],
      count: homes[1],
    };
  }

  async getHomesByUserId(
    userId: string,
  ): Promise<{ data: Home[]; count: number }> {
    const homes = await this.homeRepo.findAndCount({
      where: {
        userHomeMaps: {
          user: {
            uniqueId: userId,
          },
        },
      },
      relations: ['userHomeMaps'],
    });

    return {
      data: homes[0],
      count: homes[1],
    };
  }

  async getHome(uniqueId: string): Promise<Home> {
    const home = await this.homeRepo.findOne({
      where: {
        uniqueId,
      },
    });

    if (!home) {
      throw new NotFoundException('Home not found');
    }

    return home;
  }

  async updateHomeUsers(homeId: number, userIds: number[]) {
    // userIds can be validated here

    const userHomeMaps = await this.userHomeMapRepo.find({
      where: {
        home: {
          id: homeId,
        },
      },
    });

    const existingUserIdSet: Set<number> = new Set();

    // Remove users that are not in the request body
    userHomeMaps.forEach((userHomeMap) => {
      // We can create a userIds set to optimize this for large datasets
      if (!userIds.includes(userHomeMap.userId)) {
        this.userHomeMapRepo.delete(userHomeMap.id);
      } else {
        existingUserIdSet.add(userHomeMap.userId);
      }
    });

    const newUserHomeMaps: UserHomeMap[] = [];

    // Add new users that are not in the database
    userIds.map((userId) => {
      if (!existingUserIdSet.has(userId)) {
        const newUserHomeMap = new UserHomeMap();
        newUserHomeMap.homeId = homeId;
        newUserHomeMap.userId = userId;
        newUserHomeMaps.push(newUserHomeMap);
      }
    });

    await this.userHomeMapRepo.save(newUserHomeMaps);

    return { success: true };
  }
}
