import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { UpdateHomeUsersDto } from './type';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  async getHomes(@Query('userId') userId: string) {
    if (!userId) {
      return await this.homeService.getAllHomes();
    }

    return await this.homeService.getHomesByUserId(userId);
  }

  @Get(':id')
  getUser(@Param('id') id: string) {
    return this.homeService.getHome(id);
  }

  @Put(':homeId/users')
  async updateHomeUsers(
    @Param('homeId') homeId: string,
    @Body() body: UpdateHomeUsersDto,
  ) {
    const home = await this.homeService.getHome(homeId);

    if (!home) {
      throw new BadRequestException('Home Not Found');
    }

    if (!body.userIds || body.userIds.length === 0) {
      throw new BadRequestException('At least one user id is required');
    }

    return await this.homeService.updateHomeUsers(home.id, body.userIds);
  }
}
