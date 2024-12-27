import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GardModule } from './strategy/gard.module';
import { UserEntity } from 'src/libs/database/entities/user.entity';
import { UtilsModule } from '../util/util.module';
import { HelperRedisModule } from 'src/libs/redis/redis.module';
import { RedisService } from 'src/libs/redis/redis.service';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    UtilsModule,
    GardModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, RedisService],
})
export class AuthModule { }
