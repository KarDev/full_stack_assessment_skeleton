import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HomeModule } from './modules/home/home.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';

@Module({
  imports: [
    HomeModule,
    UsersModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: +process.env.MYSQL_PORT || 3306,
      username: process.env.MYSQL_USER || 'db_user',
      password: process.env.MYSQL_PASSWORD || '6equj5_db_user',
      database: process.env.MYSQL_DATABASE || 'home_db',
      entities: [join(__dirname, 'entities/**', '*.{ts,js}')],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
