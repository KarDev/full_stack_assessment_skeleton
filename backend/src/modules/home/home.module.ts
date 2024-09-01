import { Module } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeController } from './home.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Home } from '../../entities/Home';
import { UserHomeMap } from '../../entities/UserHomeMap';

@Module({
  imports: [TypeOrmModule.forFeature([Home, UserHomeMap])],
  controllers: [HomeController],
  providers: [HomeService],
})
export class HomeModule {}
