import { Module } from '@nestjs/common';
import { QuestionsModule } from './questions/questions.module';
import { AnswersModule } from './answers/answers.module';
import { SearchModule } from './search-questions/search-questions.module';
import { AdminModule } from './admin/admin.module';
import { DatabaseModule } from 'src/libs/database/database.module';
import { HelperRedisModule } from 'src/libs/redis/redis.module';
import { ConfigModule } from '@nestjs/config';
import { VoteModule } from './vote/vote.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    DatabaseModule,
    HelperRedisModule,
    AuthModule,
    QuestionsModule,
    AnswersModule,
    SearchModule,
    AdminModule,
    VoteModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
